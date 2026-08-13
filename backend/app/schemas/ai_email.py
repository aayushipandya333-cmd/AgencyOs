from pydantic import BaseModel


class AIEmailRequest(BaseModel):
    company_name: str
    industry: str | None = None
    website: str | None = None
    service: str
    recipient_name: str | None = None
    additional_context: str | None = None


class AIEmailResponse(BaseModel):
    subject: str
    body: str