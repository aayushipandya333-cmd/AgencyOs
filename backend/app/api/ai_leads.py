from fastapi import APIRouter, Depends

from app.schemas.ai_lead import AILeadRequest
from app.services.ai_lead_finder import find_leads
from app.core.auth import AuthUser, require_view


router = APIRouter(
    prefix="/api/ai_leads",
    tags=["AI Lead Finder"]
)


@router.post("/find")
def find_ai_leads(
    request: AILeadRequest,
    user: AuthUser = Depends(require_view)
):
    result = find_leads(request)

    return {
        "success": True,
        "requirements": request,
        "leads": result
    }