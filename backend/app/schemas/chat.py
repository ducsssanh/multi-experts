from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    expert_id: str | None = None  # None = auto-route
    conversation_id: str | None = None


class ChatResponse(BaseModel):
    reply: str
    expert_id: str
    conversation_id: str
