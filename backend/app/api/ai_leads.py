from fastapi import APIRouter, Depends, Request

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.schemas.ai_lead import AILeadRequest
from app.services.ai_lead_finder import find_leads
from app.core.auth import AuthUser, require_view

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/api/ai_leads",
    tags=["AI Lead Finder"]
)


@router.post("/find")
@limiter.limit("10/minute")
def find_ai_leads(
    request: Request,                  # used request for slow api, we dont directly use it but slowAPI does use it.
    lead_request: AILeadRequest,
    user: AuthUser = Depends(require_view)
):
    result = find_leads(lead_request)

    return {
        "success": True,
        "requirements": lead_request,
        "leads": result
    }