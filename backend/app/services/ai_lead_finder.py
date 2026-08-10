from google import genai
from google.genai import types

from app.core.config import settings
from app.schemas.ai_lead import AILeadRequest, AILeadResponse


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def find_leads(request: AILeadRequest):
    prompt = f"""
You are an AI lead generation assistant for an IT agency.

Find potential business leads according to these requirements:

Industry: {request.industry}
Location: {request.location}
Company Size: {request.company_size or "Any"}
Service Offered: {request.service}
Number of Leads: {request.number_of_leads}

For each lead, provide:
- company_name
- website
- email
- industry
- location
- reason
- lead_score

Lead score must be a number between 0 and 100.

Important rules:
- Return only relevant companies.
- Do not invent companies or information.
- If a value is unknown, return null.
- Return exactly the requested number of leads if possible.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=list[AILeadResponse]
        )
    )

    return response.parsed