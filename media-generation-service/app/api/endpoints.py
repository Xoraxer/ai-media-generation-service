from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_db
from app.models.schemas import GenerateRequest, JobResponse, JobStatusResponse, JobCreate
from app.services.job_service import AsyncJobService
from app.tasks.celery_tasks import process_media_generation
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/generate", response_model=JobResponse, status_code=status.HTTP_202_ACCEPTED, tags=["Jobs"])
async def generate_media(
    request: GenerateRequest,
    db: AsyncSession = Depends(get_async_db)
):
    """Submit a new image generation job."""
    try:
        # Create job in database
        job_data = JobCreate(**request.model_dump())
        job = await AsyncJobService.create_job(db, job_data)
        
        # Enqueue background task
        process_media_generation.delay(
            job_id=job.id,
            model=job.model,
            input_data={"prompt": job.prompt, **job.parameters}
        )
        
        logger.info(f"Enqueued job {job.id} for processing")
        return JobResponse(
            job_id=job.id,
            status=job.status,
            message="Job accepted for processing"
        )
    except Exception as e:
        logger.error(f"Failed to create job: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while creating the job."
        )


@router.get("/status/{job_id}", response_model=JobStatusResponse, tags=["Jobs"])
async def get_job_status(
    job_id: str,
    db: AsyncSession = Depends(get_async_db)
):
    """Get the status and result of a specific job."""
    job = await AsyncJobService.get_job(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    return JobStatusResponse.model_validate(job)


@router.get("/jobs", response_model=List[JobStatusResponse], tags=["Jobs"])
async def get_recent_jobs(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_async_db)
):
    """Get a list of recent jobs (all statuses)."""
    if limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit cannot exceed 100"
        )
    
    jobs = await AsyncJobService.get_recent_jobs(db, skip=skip, limit=limit)
    return [JobStatusResponse.model_validate(job) for job in jobs]


@router.get("/jobs/completed", response_model=List[JobStatusResponse], tags=["Jobs"])
async def get_completed_jobs(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_async_db)
):
    """Get a list of recent completed jobs only."""
    if limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit cannot exceed 100"
        )
    
    jobs = await AsyncJobService.get_completed_jobs(db, skip=skip, limit=limit)
    return [JobStatusResponse.model_validate(job) for job in jobs]


@router.delete("/jobs/failed", tags=["Jobs"])
async def delete_failed_jobs(
    db: AsyncSession = Depends(get_async_db)
):
    """Delete all failed jobs from the database."""
    deleted_count = await AsyncJobService.delete_failed_jobs(db)
    return {
        "message": f"Successfully deleted {deleted_count} failed jobs",
        "deleted_count": deleted_count
    }


@router.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "media-generation-api"} 