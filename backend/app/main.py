from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api import tasks
from app.api import leads
from app.models.task import Task
from app.models.lead import Lead

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title = "Agency OS API",
    description = "B2B Agency OS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(leads.router)