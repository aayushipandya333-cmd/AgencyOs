from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class LeadCreate(BaseModel):
    company_name: str
    website: Optional[str] = None
    email: Optional[str] = None
    industry: Optional[str] = None
    status: str = "New"
    notes: Optional[str] = None


class LeadUpdate(BaseModel):
    company_name: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    industry: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class LeadResponse(BaseModel):
    id: str
    company_name: str
    website: Optional[str]
    email: Optional[str]
    industry: Optional[str]
    status: str
    notes: Optional[str]
    org_id: str
    created_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True