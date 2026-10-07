from app.vectore_store.database import get_vector_store

def get_relevant_documents(question: str, k: int = 4):
    vector_store = get_vector_store()

    result = vector_store.similarity_search(
        question,
        k = k
    ) 
    return result