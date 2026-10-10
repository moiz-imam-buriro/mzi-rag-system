from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers.chat_router import router as chat_router
from app.api.routers.document_router import router as document_router
from app.ingestion.loader import load_document
from app.ingestion.splitter import split_documents
from app.vectore_store.database import (
    add_documents_to_vector_store,
    get_vector_store,
)


def ingest_existing_documents():
    """
    Free hosting wipes the vector database on restart.
    If the database is empty, rebuild it from the PDFs in the document folder.
    """
    vector_store = get_vector_store()

    if vector_store.get(limit=1)["ids"]:
        return  # database already has data

    for pdf_path in sorted(Path("document").glob("*.pdf")):
        chunks = split_documents(load_document(str(pdf_path)))

        for chunk in chunks:
            chunk.metadata["original_filename"] = pdf_path.name

        add_documents_to_vector_store(chunks)
        print(f"Indexed on startup: {pdf_path.name}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        ingest_existing_documents()
    except Exception as exc:
        print(f"Startup indexing failed: {exc}")
    yield


app = FastAPI(
    title="MZI API",
    description="Enterprise Knowledge Intelligence System",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "MZI API"
    }


app.include_router(chat_router)
app.include_router(document_router)
