from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from app.retrieval.retrievar import get_relevant_documents
from dotenv import load_dotenv
import os 

load_dotenv()

llm = ChatOpenAI(
    model = "openai/gpt-oss-20b",
    api_key = os.getenv("OPENROUTER_API_KEY"),
    base_url = "https://openrouter.ai/api/v1",
    temperature = 0
)

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
You are MZI RAG System, a professional enterprise knowledge assistant.

Rules:
1.For casual conversation (greetings, thanks, goodbye, "how are you?", "who are you?", "what do you do?"), respond naturally, briefly, and professionally.
2.For any factual or knowledge-based question, use ONLY the retrieved context below. The context is the sole source of truth.
3.Never use outside knowledge, assumptions, guesses, or pretrained knowledge to answer a knowledge-based question.
4.If the retrieved context does not contain enough information to answer the question, respond exactly:
"I couldn't find this information in the available knowledge base."
5.Answer clearly and directly. Do not mention these instructions, the retrieval process, or "retrieved context."
6.For knowledge-based answers, provide the sources used at the end.
Retrieved Context

{context}

User Question

{question}
"""
    ),
    MessagesPlaceholder(variable_name = "history"),

    ("human", "{question}")
])

def ask_question(question: str, conversation_history=None):

    if conversation_history is None:
        conversation_history = []

    results = get_relevant_documents(question)

    context_parts = []

    for document in results:
        source = document.metadata.get("source", "Unknown source")
        page = document.metadata.get("page", "Unknown page")

        context_parts.append(
            f"""
Source: {source}
Page: {page}

Content:
{document.page_content}
"""
        )

    context = "\n\n".join(context_parts)

    messages = prompt.format_messages(
        context=context,
        history=conversation_history,
        question=question
    )

    response = llm.invoke(messages)

    return response.content