from google import genai
from google.genai import types

from app.core.config import settings
from app.schemas.ai_email import AIEmailRequest, AIEmailResponse


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def generate_email(request: AIEmailRequest):

    prompt = f"""
You are an AI email-writing assistant for an IT agency.

Create a professional, personalized B2B outreach email.

Lead information:
Company: {request.company_name}
Industry: {request.industry or "Unknown"}
Website: {request.website or "Unknown"}
Recipient Name: {request.recipient_name or "Team"}

Our service:
{request.service}

Additional context:
{request.additional_context or "None"}

Requirements:

- Write a professional but natural email.
- Keep it concise.
- Do not make false claims about the company.
- Clearly explain how our service can help.
- Include a simple call to action.
- Do not use excessive marketing language.
- Return only the subject and email body.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AIEmailResponse
        )
    )

    return response.parsed