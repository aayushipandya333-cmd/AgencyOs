import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime

from app.core.database import Base


class GmailOAuthState(Base):
    __tablename__ = "gmail_oauth_states"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    state = Column(
        String(255),
        nullable=False,
        unique=True,
        index=True
    )

    org_id = Column(
        String,
        nullable=False,
        index=True
    )

    user_id = Column(
        String,
        nullable=False
    )

    code_verifier = Column(
    String,
    nullable=False
)

    expires_at = Column(
        DateTime,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )