from dotenv import load_dotenv
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from models.chatbot import ChatRequest
from services.chatbot import stream_response

load_dotenv()

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


@router.post("/")
async def chat(request: ChatRequest):
    messages = [m.model_dump() for m in request.messages]
    return StreamingResponse(stream_response(messages), media_type="text/plain")
