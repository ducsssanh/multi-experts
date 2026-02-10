from sqlalchemy import Column, String, Text
from app.db.session import Base


class Expert(Base):
    __tablename__ = "experts"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    # TODO: add model_name, endpoint_url, etc.
