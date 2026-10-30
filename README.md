MZI Enterprise Intelligence RAG System

A RAG (retrieval-augmented generation) application for An Enterprise Agency or Industry so your employee or manager or CEO can ask questions about your own PDF documents. You upload a PDF, ask a question in the chat, and get an answer based only on the document, with the source file and page number.

Demo video: https://youtu.be/iYCuOvJHc8w

Features
Upload and process PDF documents
Semantic search over a persistent Chroma vector database
Answers grounded in the retrieved text, with source and page references
Says so when the documents don't contain the answer
Chat sessions with conversation history
Duplicate chunk detection when the same document is uploaded again
FastAPI REST API with automatic Swagger docs
React + TypeScript frontend with light and dark mode
How it works
text
PDF -> loader -> text splitter -> embeddings -> Chroma
                                                  |
Question -> embedding -> similarity search -------+
                              |
                    relevant chunks + question
                              |
                             LLM
                              |
                  answer + source and page
Tech stack
Backend: Python, FastAPI, LangChain, Chroma, Pydantic
Frontend: React, TypeScript, Vite, Tailwind CSS
Models (via OpenRouter): openai/gpt-oss-20b for answers, openai/text-embedding-3-small for embeddings
About this project

I built the backend and the RAG pipeline myself: document ingestion, chunking, the vector store, retrieval, the chat logic and the API. The frontend was generated with an AI tool (xxx tool) and then connected to my API.

Project structure
text
app/
  api/
    main.py
    routers/
      chat_router.py
      document_router.py
  ingestion/
    loader.py
    splitter.py
  retrieval/
    rag_chain.py
    retrievar.py
  vectore_store/
    database.py
  frontend/
    src/
    package.json
    vite.config.ts
.env.example
requirements.txt

The document/ and vector_db/ folders are not part of the repository. They are created on your machine when you upload PDFs.

Run locally

You need Python, Node.js and an OpenRouter API key.

1. Clone the repository

powershell
git clone https://github.com/moiz-imam-buriro/YOUR_REPO.git
cd YOUR_REPO

2. Backend

Copy .env.example to .env in the project root and add your key:

env
OPENROUTER_API_KEY=your_openrouter_api_key

Then:

powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.api.main:app --reload

The API runs at http://127.0.0.1:8000, and the interactive docs are at /docs.

3. Frontend

In a second terminal, create app/frontend/.env:

env
VITE_API_BASE_URL=http://127.0.0.1:8000

Then:

powershell
cd app/frontend
npm install
npm run dev

Open http://localhost:5173, upload a PDF and start asking questions.

API
Method	Endpoint	Description
GET	/health	API status
POST	/chat	Ask a question
GET	/document	List uploaded documents
POST	/document/upload	Upload and index a PDF
Limitations
PDF files only
No user login
No endpoint for deleting documents yet
Vector data is stored on local disk
Not deployed online; run it locally using the steps above
Author

Moiz Imam
