from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator

from typing import Optional
from app.models.task import TaskStatus



class TaskCreate(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=200
    )

    description: Optional[str] = Field(
        default=None,
        max_length=5000
    )

    status: TaskStatus = TaskStatus.PENDING

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Title cannot be empty or whitespace")

        return value



class TaskUpdate(BaseModel):
    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=200
    )

    description: Optional[str] = Field(
        default=None,
        max_length=5000
    )

    status: Optional[TaskStatus] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("Title cannot be empty or whitespace")

        return value




    

class TaskStatusUpdate(BaseModel) :
    status: TaskStatus

class TaskResponse(BaseModel) :
    id: str
    title: str
    description: Optional[str]
    status: TaskStatus
    org_id: str
    created_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True