
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse

from app.core.auth import AuthUser, get_current_user
from app.schemas.send_email import SendEmailRequest

from app.services.send_email import (
    get_google_authorization_url,
    get_oauth_state,
    exchange_code_for_tokens,
    save_gmail_connection,
    delete_oauth_state,
    get_gmail_connection,
    send_gmail_email
)

router = APIRouter(
    prefix="/api/email",
    tags=["Email"]
)


@router.get("/gmail/connect")
def connect_gmail(
    current_user: AuthUser = Depends(get_current_user)
):
    """
    Start Google OAuth for the current Clerk organization.
    """

    if not current_user.org_id:
        raise HTTPException(
            status_code=400,
            detail="No active organization found."
        )

    authorization_url = get_google_authorization_url(
        org_id=current_user.org_id,
        user_id=current_user.user_id
    )

    return {
        "authorization_url": authorization_url
    }


@router.get("/gmail/status")
def gmail_status(
    current_user: AuthUser = Depends(get_current_user)
):
    """
    Check whether the current organization
    has a connected Gmail account.
    """

    if not current_user.org_id:
        raise HTTPException(
            status_code=400,
            detail="No active organization found."
        )

    connection = get_gmail_connection(
        current_user.org_id
    )

    if not connection:
        return {
            "connected": False,
            "gmail_email": None
        }

    return connection


@router.post("/send")
def send_email(
    request: SendEmailRequest,
    current_user: AuthUser = Depends(get_current_user)
):
    """
    Send an email using the Gmail account
    connected to the current Clerk organization.
    """

    if not current_user.org_id:
        raise HTTPException(
            status_code=400,
            detail="No active organization found."
        )

    try:

        result = send_gmail_email(
            org_id=current_user.org_id,
            recipient_email=request.recipient_email,
            subject=request.subject,
            body=request.body
        )

        return result

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(e)}"
        )

@router.get("/gmail/callback")
def gmail_callback(
    code: str,
    state: str
):
    """
    Google redirects here after the user
    authorizes AgencyOS.
    """

    try:

        oauth_data = get_oauth_state(state)

        org_id = oauth_data["org_id"]

        credentials = exchange_code_for_tokens(
            code=code,
            state=state,
            code_verifier=oauth_data["code_verifier"]
        )

        gmail_email = save_gmail_connection(
            org_id=org_id,
            credentials=credentials
        )

        delete_oauth_state(state)

        return {
            "success": True,
            "message": "Gmail connected successfully.",
            "gmail_email": gmail_email
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to connect Gmail: {str(e)}"
        )



