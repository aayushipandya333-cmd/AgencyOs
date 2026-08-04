import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from app.core.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    company_name = Column(String(255), nullable=False)

    website = Column(String(255), nullable=True)

    email = Column(String(255), nullable=True)

    industry = Column(String(255), nullable=True)

    status = Column(
        String(50),
        nullable=False,
        default="New"
    )

    notes = Column(Text, nullable=True)

    org_id = Column(
        String,
        nullable=False,
        index=True
    )

    created_by = Column(
        String,
        nullable=False
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