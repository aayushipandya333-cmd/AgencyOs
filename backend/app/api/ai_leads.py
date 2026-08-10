from fastapi import APIRouter
from app.schemas.ai_lead import AILeadRequest
from app.services.ai_lead_finder import find_leads


router = APIRouter(prefix="/api/ai_leads", tags=["AI Lead Finder"])

@router.post("/find")
def find_ai_leads(request: AILeadRequest):
    result = find_leads(request)

    return {
        "success": True,
        "requirements": request,
        "leads": result
    }