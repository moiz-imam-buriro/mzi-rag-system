import shutil
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.ingestion.loader import load_document
from app.ingestion.splitter import split_documents
from app.vectore_store.database import add_documents_to_vector_store


router = APIRouter(
    prefix="/document",
    tags=["Document"]
)

DOCUMENTS_DIR = Path("document")
DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)


@router.get("")
def get_documents():
    """
    Return all PDF documents currently stored in the document folder.
    """
    documents = []

    for file_path in sorted(DOCUMENTS_DIR.glob("*.pdf")):
        documents.append({
            "filename": file_path.name
        })

    return {
        "documents": documents
    }


@router.post("/upload")
def upload_document(file: UploadFile = File(...)):

    if not file.filename or Path(file.filename).suffix.lower() != ".pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    # Keep the original uploaded filename.
    # Path(...).name prevents paths such as ../../something.pdf.
    original_filename = Path(file.filename).name

    saved_path = DOCUMENTS_DIR / original_filename

    # Prevent accidental overwriting of an existing document.
    if saved_path.exists():
        raise HTTPException(
            status_code=409,
            detail=f"A document named '{original_filename}' already exists."
        )

    try:
        with saved_path.open("wb") as destination:
            shutil.copyfileobj(file.file, destination)

        documents = load_document(str(saved_path))
        chunks = split_documents(documents)

        if not chunks:
            saved_path.unlink(missing_ok=True)

            raise HTTPException(
                status_code=400,
                detail="No readable text was found in the PDF."
            )

        # Store the original filename in metadata
        # so future source displays can use it.
        for chunk in chunks:
            chunk.metadata["original_filename"] = original_filename

        add_documents_to_vector_store(chunks)

        return {
            "message": "Document processed successfully.",
            "filename": original_filename,
            "pages_loaded": len(documents),
            "chunks_created": len(chunks)
        }

    except HTTPException:
        raise

    except Exception as exc:

        if saved_path.exists():
            saved_path.unlink()

        raise HTTPException(
            status_code=500,
            detail="Document processing failed."
        ) from exc

    finally:
        file.file.close()