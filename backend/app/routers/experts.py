from fastapi import APIRouter

from app.schemas.expert import ExpertRead

router = APIRouter()


@router.get("/", response_model=list[ExpertRead])
async def list_experts():
    # TODO: return available experts from expert_service
    ...


@router.get("/{expert_id}", response_model=ExpertRead)
async def get_expert(expert_id: str):
    # TODO: return expert details
    ...
