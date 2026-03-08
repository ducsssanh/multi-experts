from fastapi import APIRouter

from app.schemas.expert import ExpertRead
from app.services import expert_service

router = APIRouter()


@router.get("/", response_model=list[ExpertRead])
async def list_experts():
    return expert_service.list_experts()


@router.get("/{expert_id}", response_model=ExpertRead)
async def get_expert(expert_id: str):
    return expert_service.get_expert(expert_id)
