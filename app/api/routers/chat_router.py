from fastapi import APIRouter
from pydantic import BaseModel
from uuid import uuid4

from langchain_core.messages import HumanMessage, AIMessage

from app.retrieval.rag_chain import ask_question

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

conversation_history = {}

class ChatRequest(BaseModel):
    session_id: str
    question: str


class ChatResponse(BaseModel):
    question: str
    answer: str


@router.post("", response_model = ChatResponse)
def chat(request: ChatRequest):

    history = conversation_history.get(request.session_id, [])

    answer = ask_question(
        question = request.question,
        conversation_history = history
    )

    history.append(HumanMessage(content = request.question))
    history.append(AIMessage(content = answer))

    conversation_history[request.session_id] = history

    return {
        "question": request.question,
        "answer": answer
    }