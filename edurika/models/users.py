from sqlalchemy import Column, DateTime, Integer, String, func

from edurika.models.base_class import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    created_time: Column = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)  # type: ignore[type-arg]
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    public_name = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    subtitle = Column(String, nullable=True)
    description = Column(String, nullable=True)
