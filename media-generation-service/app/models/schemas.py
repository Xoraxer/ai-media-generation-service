from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum


class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=2000, description="Text prompt for image generation")
    model: str = Field(..., description="Replicate model identifier")
    parameters: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional model parameters")


class JobCreate(BaseModel):
    prompt: str
    model: str
    parameters: Dict[str, Any] = Field(default_factory=dict)


class JobResponse(BaseModel):
    job_id: str
    status: str
    message: str


class JobStatusResponse(BaseModel):
    id: str
    prompt: str
    model: str
    parameters: Dict[str, Any]
    status: JobStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    media_path: Optional[str] = None
    error_message: Optional[str] = None
    retry_count: int = 0

    class Config:
        from_attributes = True


class JobUpdate(BaseModel):
    status: Optional[JobStatus] = None
    media_path: Optional[str] = None
    error_message: Optional[str] = None
    replicate_prediction_id: Optional[str] = None
    retry_count: Optional[int] = None 