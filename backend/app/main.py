# This file works around : Creating Application → Connect Database → Allow CORS → Register APIs → Ready to start Server 


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware              # A middleware runs before your request reaches your API and before the response goes back to the client. CORS - Cross-Origin Resource Sharing. a browser security feature that controls whether a frontend running on one origin (domain/port/protocol) can access a backend running on another origin.
from app.core.config import settings
from app.core.database import engine, Base
from app.api import tasks
from app.api import leads
from app.api import ai_leads
from app.models.task import Task
from app.models.lead import Lead

Base.metadata.create_all(bind=engine)                       # instructs SQLAlchemy to create all tables defined by models that inherit from Base. It uses the engine to connect to the configured database and creates only the tables that do not already exist.

app = FastAPI(
    title = "Agency OS API",
    description = "B2B Agency OS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],                
    allow_credentials=True,                                # Allow Authorization, Cookies, JWT
    allow_methods=["*"],                                   # allow all methods : GET, POST, PUT, PATCH, DELETE
    allow_headers=["*"],
)

app.include_router(tasks.router)                            # register all endpoints of api -> tasks.py into application
app.include_router(leads.router)                            # register all endpoints of api -> leads.py into application\
app.include_router(ai_leads.router)