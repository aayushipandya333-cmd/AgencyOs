from fastapi import APIRouter, Depends

from app.schemas.ai_email import AIEmailRequest
from app.services.ai_email import generate_email
from app.core.auth import AuthUser, require_view


router = APIRouter(
    prefix="/api/ai_email",
    tags=["AI Email"]
)


@router.post("/generate")
def generate_ai_email(
    request: AIEmailRequest,
    user: AuthUser = Depends(require_view)
):
    result = generate_email(request)

    return {
        "success": True,
        "email": result
    }