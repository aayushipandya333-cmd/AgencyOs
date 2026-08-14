# This file works around : Creating Application → Connect Database → Allow CORS → Register APIs → Ready to start Server 


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware              # A middleware runs before your request reaches your API and before the response goes back to the client. CORS - Cross-Origin Resource Sharing. a browser security feature that controls whether a frontend running on one origin (domain/port/protocol) can access a backend running on another origin.

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import engine, Base
from app.core.request_size import RequestSizeLimitMiddleware
from app.core.security_headers import SecurityHeadersMiddleware

from app.api import tasks
from app.api import leads
from app.api import ai_leads
from app.api import ai_email
from app.api import send_email
from app.models.task import Task
from app.models.lead import Lead
from app.models.gmail_connection import GmailConnection
from app.models.gmail_oauth_state import GmailOAuthState


Base.metadata.create_all(bind=engine)                       # instructs SQLAlchemy to create all tables defined by models that inherit from Base. It uses the engine to connect to the configured database and creates only the tables that do not already exist.

app = FastAPI(
    title = "Agency OS API",
    description = "B2B Agency OS",
    version="1.0.0"
)




limiter = Limiter(key_func=get_remote_address)                       # to find ip address of the request so that limiter can count seperately for individual ip address

app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],                
    allow_credentials=True,                                # Allow Authorization, Cookies, JWT
    allow_methods=["*"],                                   # allow all methods : GET, POST, PUT, PATCH, DELETE
    allow_headers=["*"],
)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestSizeLimitMiddleware)

app.include_router(tasks.router)                            # register all endpoints of api -> tasks.py into application
app.include_router(leads.router)                            # register all endpoints of api -> leads.py into application\
app.include_router(ai_leads.router)
app.include_router(ai_email.router)
app.include_router(send_email.router)