
import secrets
import hashlib
import base64
from datetime import datetime, timedelta
from email.mime.text import MIMEText

from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

from app.core.config import settings
from app.core.database import SessionLocal
from app.models.gmail_connection import GmailConnection
from app.models.gmail_oauth_state import GmailOAuthState

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

GMAIL_SCOPES = [
     "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly"
]


def create_google_flow(state=None):
    """
    Create the Google OAuth flow.
    """

    client_config = {
        "web": {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [
                settings.GOOGLE_REDIRECT_URI
            ]
        }
    }

    flow = Flow.from_client_config(
        client_config,
        scopes=GMAIL_SCOPES,
        state=state,
        redirect_uri=settings.GOOGLE_REDIRECT_URI
    )

    return flow


def create_code_challenge(code_verifier: str):
    """
    Create the PKCE code challenge from the
    code verifier.
    """

    digest = hashlib.sha256(
        code_verifier.encode("utf-8")
    ).digest()

    return base64.urlsafe_b64encode(
        digest
    ).decode("utf-8").rstrip("=")


def create_oauth_state(org_id: str, user_id: str):
    """
    Create and store a secure OAuth state
    associated with the Clerk organization.
    """

    db = SessionLocal()

    try:
        state = secrets.token_urlsafe(32)

        code_verifier = secrets.token_urlsafe(64)

        expires_at = datetime.utcnow() + timedelta(minutes=10)

        oauth_state = GmailOAuthState(
            state=state,
            org_id=org_id,
            user_id=user_id,
            code_verifier=code_verifier,
            expires_at=expires_at
        )

        db.add(oauth_state)
        db.commit()

        return state, code_verifier

    finally:
        db.close()


def get_google_authorization_url(org_id: str, user_id: str):
    """
    Create the Google authorization URL for
    the current Clerk organization.
    """

    state, code_verifier = create_oauth_state(
    org_id=org_id,
    user_id=user_id
)

    flow = create_google_flow(state=state)

    code_challenge = create_code_challenge(
    code_verifier
)

    authorization_url, _ = flow.authorization_url(
    access_type="offline",
    include_granted_scopes="false",
    prompt="consent",
    code_challenge=code_challenge,
    code_challenge_method="S256"
)

    return authorization_url


def get_oauth_state(state: str):
    """
    Retrieve and validate the OAuth state.
    """

    db = SessionLocal()

    try:
        oauth_state = (
            db.query(GmailOAuthState)
            .filter(
                GmailOAuthState.state == state
            )
            .first()
        )

        if not oauth_state:
            raise ValueError(
                "Invalid OAuth state."
            )

        if oauth_state.expires_at < datetime.utcnow():
            db.delete(oauth_state)
            db.commit()

            raise ValueError(
                "OAuth state has expired."
            )

        return {
             "org_id": oauth_state.org_id,
            "user_id": oauth_state.user_id,
            "code_verifier": oauth_state.code_verifier
        }

    finally:
        db.close()


def exchange_code_for_tokens(
    code: str,
    state: str,
    code_verifier: str
):
    """
    Exchange Google's authorization code
    for access and refresh tokens.
    """

    flow = create_google_flow(
        state=state
    )

    flow.fetch_token(
        code=code,
        code_verifier=code_verifier
    )

    return flow.credentials


def get_gmail_address(credentials):
    """
    Get the Gmail address that authorized AgencyOS.
    """

    gmail_service = build(
        "gmail",
        "v1",
        credentials=credentials
    )

    profile = (
        gmail_service.users()
        .getProfile(userId="me")
        .execute()
    )

    return profile["emailAddress"]


def save_gmail_connection(org_id: str, credentials):
    """
    Save or update the Gmail connection for
    the specified Clerk organization.
    """

    db = SessionLocal()

    try:
        gmail_email = get_gmail_address(credentials)

        existing_connection = (
            db.query(GmailConnection)
            .filter(
                GmailConnection.org_id == org_id
            )
            .first()
        )

        token_expiry = None

        if credentials.expiry:
            token_expiry = credentials.expiry.replace(
                tzinfo=None
            )

        if existing_connection:

            existing_connection.gmail_email = gmail_email

            existing_connection.access_token = (
                credentials.token
            )

            if credentials.refresh_token:
                existing_connection.refresh_token = (
                    credentials.refresh_token
                )

            existing_connection.token_expiry = (
                token_expiry
            )

            existing_connection.updated_at = (
                datetime.utcnow()
            )

        else:

            if not credentials.refresh_token:
                raise ValueError(
                    "Google did not provide a refresh token."
                )

            connection = GmailConnection(
                org_id=org_id,
                gmail_email=gmail_email,
                access_token=credentials.token,
                refresh_token=credentials.refresh_token,
                token_expiry=token_expiry
            )

            db.add(connection)

        db.commit()

        return gmail_email

    finally:
        db.close()


def delete_oauth_state(state: str):
    """
    Delete a used OAuth state.
    """

    db = SessionLocal()

    try:
        oauth_state = (
            db.query(GmailOAuthState)
            .filter(
                GmailOAuthState.state == state
            )
            .first()
        )

        if oauth_state:
            db.delete(oauth_state)
            db.commit()

    finally:
        db.close()


def get_gmail_connection(org_id: str):
    """
    Get the Gmail connection for an organization.
    """

    db = SessionLocal()

    try:
        connection = (
            db.query(GmailConnection)
            .filter(
                GmailConnection.org_id == org_id
            )
            .first()
        )

        if not connection:
            return None

        return {
            "id": connection.id,
            "gmail_email": connection.gmail_email,
            "access_token": connection.access_token,
            "refresh_token": connection.refresh_token,
            "token_expiry": connection.token_expiry,
            "connected": True
        }

    finally:
        db.close()


def send_gmail_email(
    org_id: str,
    recipient_email: str,
    subject: str,
    body: str
):
    """
    Send an email using the Gmail account
    connected to the organization.
    """

    connection = get_gmail_connection(org_id)

    if not connection:
        raise ValueError(
            "Gmail is not connected for this organization."
        )

    credentials = refresh_gmail_access_token(org_id)

    gmail_service = build(
    "gmail",
    "v1",
    credentials=credentials
)
    message = MIMEText(body)
    message["to"] = recipient_email
    message["subject"] = subject

    raw_message = base64.urlsafe_b64encode(
    message.as_bytes()
    ).decode()

    sent_message = (
    gmail_service.users()
    .messages()
    .send(
        userId="me",
        body={
            "raw": raw_message
        }
    )
    .execute()
    )

    return {
    "success": True,
    "message_id": sent_message["id"],
    "gmail_email": connection["gmail_email"]
    }

def refresh_gmail_access_token(org_id: str):
    """
    Refresh the Gmail access token for an organization
    if the current access token has expired.
    """

    db = SessionLocal()

    try:
        connection = (
            db.query(GmailConnection)
            .filter(
                GmailConnection.org_id == org_id
            )
            .first()
        )

        if not connection:
            raise ValueError(
                "Gmail is not connected for this organization."
            )

        credentials = Credentials(
            token=connection.access_token,
            refresh_token=connection.refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET,
            scopes=GMAIL_SCOPES
        )

        if not credentials.valid:

            credentials.refresh(Request())

            connection.access_token = credentials.token

            if credentials.expiry:
                connection.token_expiry = (
                    credentials.expiry.replace(tzinfo=None)
                )

            connection.updated_at = datetime.utcnow()

            db.commit()

        return credentials

    finally:
        db.close()