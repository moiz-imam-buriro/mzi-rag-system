from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_documents(documents: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size = 1000,
        chunk_overlap = 100
    )
    chunks = splitter.split_documents(documents)

    return chunks
