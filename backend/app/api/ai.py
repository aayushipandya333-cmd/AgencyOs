from fastapi import APIRouter
from app.services.ai_lead_finder import find_leads

router = APIRouter()

@router.get("/test")
def test_ai():
    try:
        return find_leads("Say hello and confirm that the AI connection is working.")
    except Exception as e:
        return {"error": str(e)}