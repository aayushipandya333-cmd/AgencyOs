from pydantic import BaseModel, EmailStr


class SendEmailRequest(BaseModel):
    recipient_email: EmailStr
    subject: str
    body: str