from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from sqlalchemy import select, desc, update, delete
from app.models.job import Job
from app.models.schemas import JobCreate, JobStatus, JobUpdate
from typing import Optional, List
import uuid
import logging

logger = logging.getLogger(__name__)


class AsyncJobService:
    """Async service for FastAPI endpoints."""
    
    @staticmethod
    async def create_job(db: AsyncSession, job_data: JobCreate) -> Job:
        """Create a new job in the database."""
        job = Job(
            id=str(uuid.uuid4()),
            prompt=job_data.prompt,
            model=job_data.model,
            parameters=job_data.parameters,
            status=JobStatus.PENDING.value
        )
        db.add(job)
        await db.commit()
        await db.refresh(job)
        logger.info(f"Created job {job.id}")
        return job

    @staticmethod
    async def get_job(db: AsyncSession, job_id: str) -> Optional[Job]:
        """Get a job by ID."""
        result = await db.execute(select(Job).where(Job.id == job_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_recent_jobs(db: AsyncSession, skip: int = 0, limit: int = 20) -> List[Job]:
        """Get recent jobs ordered by creation date."""
        result = await db.execute(
            select(Job)
            .order_by(desc(Job.created_at))
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_completed_jobs(db: AsyncSession, skip: int = 0, limit: int = 20) -> List[Job]:
        """Get recent completed jobs only, ordered by creation date."""
        result = await db.execute(
            select(Job)
            .where(Job.status == JobStatus.COMPLETED.value)
            .order_by(desc(Job.created_at))
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    @staticmethod
    async def update_job(db: AsyncSession, job_id: str, job_update: JobUpdate) -> Optional[Job]:
        """Update a job's status and other fields."""
        update_data = job_update.model_dump(exclude_unset=True)
        if not update_data:
            return await AsyncJobService.get_job(db, job_id)
        
        await db.execute(
            update(Job)
            .where(Job.id == job_id)
            .values(**update_data)
        )
        await db.commit()
        return await AsyncJobService.get_job(db, job_id)

    @staticmethod
    async def delete_failed_jobs(db: AsyncSession) -> int:
        """Delete all failed jobs from the database."""
        result = await db.execute(
            delete(Job).where(Job.status == JobStatus.FAILED.value)
        )
        await db.commit()
        deleted_count = result.rowcount or 0
        logger.info(f"Deleted {deleted_count} failed jobs")
        return deleted_count

    @staticmethod
    async def delete_jobs_with_local_paths(db: AsyncSession) -> int:
        """Delete completed jobs that have local image paths (broken links)."""
        result = await db.execute(
            delete(Job).where(
                (Job.status == JobStatus.COMPLETED.value) &
                (Job.media_path.like('/images/%'))
            )
        )
        await db.commit()
        deleted_count = result.rowcount or 0
        logger.info(f"Deleted {deleted_count} jobs with broken local image paths")
        return deleted_count


class SyncJobService:
    """Sync service for Celery tasks."""
    
    @staticmethod
    def get_job(db: Session, job_id: str) -> Optional[Job]:
        """Get a job by ID."""
        return db.query(Job).filter(Job.id == job_id).first()

    @staticmethod
    def update_job(db: Session, job_id: str, job_update: JobUpdate) -> Optional[Job]:
        """Update a job's status and other fields."""
        job = SyncJobService.get_job(db, job_id)
        if not job:
            return None
            
        update_data = job_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(job, key, value)
        
        db.commit()
        db.refresh(job)
        logger.info(f"Updated job {job_id} with {update_data}")
        return job

    @staticmethod
    def increment_retry_count(db: Session, job_id: str) -> Optional[Job]:
        """Increment the retry count for a job."""
        job = SyncJobService.get_job(db, job_id)
        if job:
            job.retry_count += 1
            db.commit()
            db.refresh(job)
        return job 