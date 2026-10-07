from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv
import hashlib
import os

load_dotenv()

CHROMA_PATH = "./vector_db/chroma_db"
COLLECTION_NAME = "enterprise_intelligence"
EMBEDDING_MODEL = "openai/text-embedding-3-small"

# creating embedding model

api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    raise ValueError("OPENROUTER_API_KEY is missing")

embeddings = OpenAIEmbeddings(
    model = EMBEDDING_MODEL,
    api_key = api_key,
    base_url = "https://openrouter.ai/api/v1"
)

def get_vector_store():
    vector_store = Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=CHROMA_PATH
    )

    return vector_store


def add_documents_to_vector_store(chunks):
    vector_store = get_vector_store()
    
    new_chunks = []
    already_exists = 0

    for chunk in chunks:
        source = chunk.metadata.get("source", "")
        page = chunk.metadata.get("page", "")
        unique_text = f"{source}|{page}|{chunk.page_content}"
        chunk_id = hashlib.sha256(
            unique_text.encode("utf-8")
        ).hexdigest()

        # Check whether this chunk already exists
        existing = vector_store.get(ids=[chunk_id])
        if existing["ids"]:
            already_exists += 1
        else:
            new_chunks.append((chunk, chunk_id))

    # Add only new chunks
    if new_chunks:
        documents = [item[0] for item in new_chunks]
        ids = [item[1] for item in new_chunks]

        vector_store.add_documents(
            documents=documents,
            ids=ids
        )
    print(f"New chunks added: {len(new_chunks)}")
    print(f"Already existed: {already_exists}")

    return vector_store