from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

LeadStatus = Literal[
    "new",
    "contacted",
    "qualified",
    "closed"
]

class LeadCreate(BaseModel):
    company_name: str = Field(
        ...,
        min_length=1,
        max_length=255
    )

    website: Optional[str] = Field(
        default=None,
        max_length=255
    )

    email: Optional[EmailStr] = None

    industry: Optional[str] = Field(
        default=None,
        max_length=255
    )

    status: LeadStatus = "new"

    notes: Optional[str] = Field(
        default=None,
        max_length=5000
    )

    @field_validator("company_name")
    @classmethod
    def validate_company_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Company name cannot be empty or whitespace")

        return value




class LeadUpdate(BaseModel):
    company_name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255
    )

    website: Optional[str] = Field(
        default=None,
        max_length=255
    )

    email: Optional[EmailStr] = None

    industry: Optional[str] = Field(
        default=None,
        max_length=255
    )

    status: Optional[LeadStatus] = None

    last_contacted_at: Optional[datetime] = None

    next_follow_up_at: Optional[datetime] = None

    notes: Optional[str] = Field(
        default=None,
        max_length=5000
    )

    @field_validator("company_name")
    @classmethod
    def validate_company_name(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("Company name cannot be empty or whitespace")

        return value



class LeadResponse(BaseModel):
    id: str
    company_name: str
    website: Optional[str]
    email: Optional[EmailStr]
    industry: Optional[str]
    status: str
    last_contacted_at: Optional[datetime]
    next_follow_up_at: Optional[datetime]
    notes: Optional[str]
    org_id: str
    created_by: str
    created_at: datetime
    updated_at: datetime


    class Config:
        from_attributes = True