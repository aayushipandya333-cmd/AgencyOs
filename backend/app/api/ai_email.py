from fastapi import APIRouter, Depends, Request

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.schemas.ai_email import AIEmailRequest
from app.services.ai_email import generate_email
from app.core.auth import AuthUser, require_view

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/api/ai_email",
    tags=["AI Email"]
)


@router.post("/generate")
@limiter.limit("10/minute")
def generate_ai_email(
    request: Request,
    email_request: AIEmailRequest,
    user: AuthUser = Depends(require_view)
):
    result = generate_email(email_request)

    return {
        "success": True,
        "email": result
    }