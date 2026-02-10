from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter()


@router.post("/send", response_model=ChatResponse)
async def send_message(payload: ChatRequest):
    # TODO: route to expert via chat_service
    ...


@router.post("/stream")
async def stream_message(payload: ChatRequest):
    # TODO: return StreamingResponse with SSE from chat_service
    ...
