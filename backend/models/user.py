from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import DateTime

from sqlalchemy.orm import declarative_base

from datetime import datetime

Base = declarative_base()

class User(Base):

    __tablename__ = "users"

    id = Column(
        String,
        primary_key=True
    )

    email = Column(
        String,
        unique=True
    )

    password_hash = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )