from pydantic import BaseModel


class ExpertRead(BaseModel):
    id: str
    name: str
    description: str

    model_config = {"from_attributes": True}
