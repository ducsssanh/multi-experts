from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.chat import ChatRequest, ChatResponse
from app.services import chat_service

router = APIRouter()


@router.post("/send", response_model=ChatResponse)
async def send_message(payload: ChatRequest):
    result = await chat_service.handle_message(
        message=payload.message,
        expert_id=payload.expert_id,
        conversation_id=payload.conversation_id,
    )
    return result


@router.post("/stream")
async def stream_message(payload: ChatRequest):
    return StreamingResponse(
        chat_service.handle_stream(
            message=payload.message,
            expert_id=payload.expert_id,
            conversation_id=payload.conversation_id,
        ),
        media_type="text/event-stream",
    )
