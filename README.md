---
title: MZI RAG System
sdk: docker
app_port: 7860
---

# MZI RAG System

**Enterprise Knowledge Intelligence RAG System**

MZI RAG System is an enterprise-focused RAG application that lets users upload internal PDF documents and ask questions through a conversational interface.

The system retrieves relevant information from the organization's knowledge base and uses it to generate grounded responses with document and page references.

## Features

* Upload and process PDF documents
* Persistent Chroma vector database
* Semantic document retrieval
* Context-grounded AI responses
* Source and page references
* Clear response when information is not available
* Conversational chat sessions
* Duplicate chunk detection
* FastAPI REST API
* React + TypeScript frontend
* Responsive UI with light/dark mode
* Environment-based configuration

## Architecture

```text
React Frontend
      ↓
FastAPI API
      ↓
LangChain RAG Pipeline
      ↓
Chroma Vector Database
      ↓
OpenRouter
```

### RAG Pipeline

```text
PDF
 ↓
Document Loader
 ↓
Text Splitter
 ↓
Embeddings
 ↓
Chroma
 ↓
Similarity Search
 ↓
Relevant Context
 ↓
LLM
 ↓
Grounded Answer + Sources
```

## Tech Stack

**Backend**

* Python
* FastAPI
* LangChain
* Chroma
* Pydantic

**Frontend**

* React
* TypeScript
* Vite
* Tailwind CSS

**AI**

* OpenRouter
* `openai/gpt-oss-20b`
* `openai/text-embedding-3-small`

## Project Structure

```text
mzi-rag-system/
│
├── app/
│   ├── api/
│   │   ├── main.py
│   │   └── routers/
│   │       ├── chat_router.py
│   │       └── document_router.py
│   │
│   ├── ingestion/
│   │   ├── loader.py
│   │   └── splitter.py
│   │
│   ├── retrieval/
│   │   ├── rag_chain.py
│   │   └── retrievar.py
│   │
│   ├── vectore_store/
│   │   └── database.py
│   │
│   └── frontend/
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
│
├── document/
├── vector_db/
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## API

| Method | Endpoint           | Purpose                  |
| ------ | ------------------ | ------------------------ |
| GET    | `/health`          | Check API status         |
| POST   | `/chat`            | Ask a question           |
| GET    | `/document`        | List uploaded documents  |
| POST   | `/document/upload` | Upload and process a PDF |

Interactive API documentation is available through FastAPI Swagger at `/docs`.

## Environment Variables

### Backend

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Frontend

Create `.env` inside `app/frontend/`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Never commit real API keys or other secrets.

## Run Locally

### Backend

```powershell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.api.main:app --reload
```

### Frontend

```powershell
cd app/frontend
npm install
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

The FastAPI API normally runs on:

```text
http://127.0.0.1:8000
```

## Deployment

The application is designed to run as separate frontend and backend services.

Before deployment:

* Configure production environment variables
* Set the production frontend URL in FastAPI CORS
* Configure the frontend API URL
* Provide persistent storage for uploaded documents and the vector database
* Run the backend without development reload mode

## Author

**Moiz Imam**
AI Engineer

Built as a practical enterprise RAG application using modern AI engineering tools and deployment practices.
