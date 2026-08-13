from pydantic import BaseModel, Field, EmailStr, HttpUrl, field_validator
from typing import Optional


class AILeadRequest(BaseModel):
    industry: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    location: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    company_size: Optional[str] = Field(
        default=None,
        max_length=100
    )

    service: str = Field(
        ...,
        min_length=1,
        max_length=200
    )

    number_of_leads: int = Field(
        default=10,
        ge=1,
        le=20
    )

    @field_validator(
        "industry",
        "location",
        "service"
    )
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("This field cannot be empty or whitespace")

        return value

    @field_validator("company_size")
    @classmethod
    def validate_company_size(
        cls,
        value: Optional[str]
    ) -> Optional[str]:

        if value is None:
            return None

        value = value.strip()

        return value or None


class AILeadResponse(BaseModel):

    company_name: str = Field(
        ...,
        min_length=1,
        max_length=255
    )

    website: Optional[HttpUrl] = None

    email: Optional[EmailStr] = None

    industry: Optional[str] = Field(
        default=None,
        max_length=255
    )

    location: Optional[str] = Field(
        default=None,
        max_length=255
    )

    reason: Optional[str] = Field(
        default=None,
        max_length=2000
    )

    lead_score: Optional[int] = Field(
        default=None,
        ge=0,
        le=100
    )

    @field_validator("company_name")
    @classmethod
    def validate_company_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError(
                "Company name cannot be empty or whitespace"
            )

        return value

    @field_validator(
        "industry",
        "location",
        "reason"
    )
    @classmethod
    def clean_optional_text(
        cls,
        value: Optional[str]
    ) -> Optional[str]:

        if value is None:
            return None

        value = value.strip()

        return value or None