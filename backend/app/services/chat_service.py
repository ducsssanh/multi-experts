"""Chat orchestrator — routes messages to experts via llm_client."""

import uuid
from collections.abc import AsyncGenerator

from app.services import expert_service
from app.services.llm_client import LLMClient

llm = LLMClient()


async def handle_message(
    message: str,
    expert_id: str | None = None,
    conversation_id: str | None = None,
) -> dict:
    if expert_id:
        expert = expert_service.get_expert(expert_id)
    else:
        expert = expert_service.select_expert(message)

    reply = await llm.generate(message, model=expert["id"])

    return {
        "reply": reply,
        "expert_id": expert["id"],
        "conversation_id": conversation_id or str(uuid.uuid4()),
    }


async def handle_stream(
    message: str,
    expert_id: str | None = None,
    conversation_id: str | None = None,
) -> AsyncGenerator[str, None]:
    if expert_id:
        expert = expert_service.get_expert(expert_id)
    else:
        expert = expert_service.select_expert(message)

    conv_id = conversation_id or str(uuid.uuid4())

    # Send metadata first
    yield f"data: {{\"expert_id\": \"{expert['id']}\", \"conversation_id\": \"{conv_id}\"}}\n\n"

    # Stream tokens
    async for token in llm.stream(message, model=expert["id"]):
        yield f"data: {token}\n\n"

    yield "data: [DONE]\n\n"
