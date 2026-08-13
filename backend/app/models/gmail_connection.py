import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, DateTime

from app.core.database import Base


class GmailConnection(Base):
    __tablename__ = "gmail_connections"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    org_id = Column(
        String,
        nullable=False,
        index=True
    )

    gmail_email = Column(
        String(255),
        nullable=False
    )

    access_token = Column(
        Text,
        nullable=False
    )

    refresh_token = Column(
        Text,
        nullable=False
    )

    token_expiry = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )