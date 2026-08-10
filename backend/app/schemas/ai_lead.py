from typing import Optional

from pydantic import BaseModel


class AILeadRequest(BaseModel):
    industry: str
    location: str
    company_size: Optional[str] = None
    service: str
    number_of_leads: int = 10


class AILeadResponse(BaseModel):
    company_name: str
    website: Optional[str] = None
    email: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    reason: Optional[str] = None
    lead_score: Optional[int] = None