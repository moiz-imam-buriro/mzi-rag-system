from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers.chat_router import router as chat_router
from app.api.routers.document_router import router as document_router

app = FastAPI(
    title = "MZI API",
    description = "Enterprise Knowledge Intelligence System",
    version = "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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
