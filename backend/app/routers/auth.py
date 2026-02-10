from fastapi import APIRouter, Depends

from app.schemas.auth import UserCreate, UserRead

router = APIRouter()


@router.post("/register", response_model=UserRead)
async def register(payload: UserCreate):
    # TODO: call auth_service to create user
    ...


@router.post("/login")
async def login():
    # TODO: authenticate and return JWT
    ...


@router.get("/me", response_model=UserRead)
async def get_current_user_info():
    # TODO: return current user from JWT
    ...
