from celery import current_task
from worker.celery_app import celery_app
from app.core.database import get_sync_db
from app.services.job_service import SyncJobService
from app.services.media_client import replicate_client
from app.models.schemas import JobUpdate, JobStatus
from app.core.config import settings
import os
import logging
import requests
import uuid
from pathlib import Path
from typing import Dict, Any

logger = logging.getLogger(__name__)

def download_and_save_image(image_url: str, job_id: str) -> str:
    """Download image from URL and save it locally."""
    try:
        # Create storage directory if it doesn't exist
        storage_dir = Path("storage/generated")
        storage_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate unique filename
        file_extension = ".png"  # Default to PNG
        if image_url.lower().endswith(('.jpg', '.jpeg')):
            file_extension = ".jpg"
        elif image_url.lower().endswith('.webp'):
            file_extension = ".webp"
            
        filename = f"{job_id}_{uuid.uuid4().hex[:8]}{file_extension}"
        file_path = storage_dir / filename
        
        # Download the image
        logger.info(f"Downloading image from {image_url}")
        response = requests.get(image_url, timeout=30, stream=True)
        response.raise_for_status()
        
        # Save the image
        with open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        logger.info(f"Image saved to {file_path}")
        return filename
        
    except Exception as e:
        logger.error(f"Failed to download and save image: {e}")
        raise


@celery_app.task(bind=True, name="app.tasks.celery_tasks.process_media_generation")
def process_media_generation(self, job_id: str, model: str, input_data: Dict[str, Any]):
    """Process media generation using Replicate API."""
    logger.info(f"Starting media generation for job {job_id}")
    
    with next(get_sync_db()) as db:
        try:
            # Update job status to processing
            SyncJobService.update_job(
                db, job_id, 
                JobUpdate(status=JobStatus.PROCESSING)
            )
            
            # Create prediction with Replicate
            prediction_result = replicate_client.create_prediction(model, input_data)
            prediction_id = prediction_result["id"]
            
            # Update job with prediction ID
            SyncJobService.update_job(
                db, job_id,
                JobUpdate(replicate_prediction_id=prediction_id)
            )
            
            # Wait for prediction to complete (with 10 minute timeout)
            logger.info(f"Waiting for prediction {prediction_id} to complete")
            completed_prediction = replicate_client.wait_for_prediction(prediction_id, timeout=600)
            
            if completed_prediction["status"] == "succeeded":
                output = completed_prediction["output"]
                
                # Handle different output formats
                image_url = None
                if isinstance(output, list) and len(output) > 0:
                    image_url = output[0]
                elif isinstance(output, str):
                    image_url = output
                
                if image_url:
                    # Check if we're in production (DEBUG=false) or development
                    debug_mode = settings.debug if hasattr(settings, 'debug') else True
                    
                    if debug_mode:
                        # Development: Download and save locally
                        logger.info(f"Development mode: Downloading and saving image from: {image_url}")
                        try:
                            filename = download_and_save_image(image_url, job_id)
                            local_path = f"/images/{filename}"
                            
                            SyncJobService.update_job(
                                db, job_id,
                                JobUpdate(
                                    status=JobStatus.COMPLETED,
                                    media_path=local_path
                                )
                            )
                            logger.info(f"Job {job_id} completed successfully with local image: {local_path}")
                            
                        except Exception as download_error:
                            logger.error(f"Failed to download image for job {job_id}: {download_error}")
                            # Fall back to direct URL
                            SyncJobService.update_job(
                                db, job_id,
                                JobUpdate(
                                    status=JobStatus.COMPLETED,
                                    media_path=image_url
                                )
                            )
                            logger.warning(f"Job {job_id} completed with direct URL fallback: {image_url}")
                    else:
                        # Production: Use direct CDN URL (Render containers don't share storage)
                        logger.info(f"Production mode: Using direct CDN URL: {image_url}")
                        SyncJobService.update_job(
                            db, job_id,
                            JobUpdate(
                                status=JobStatus.COMPLETED,
                                media_path=image_url
                            )
                        )
                        logger.info(f"Job {job_id} completed successfully with CDN URL: {image_url}")
                else:
                    raise Exception("No image URL in prediction output")
            
            elif completed_prediction["status"] == "failed":
                error_msg = completed_prediction.get("error", "Prediction failed")
                raise Exception(f"Replicate prediction failed: {error_msg}")
            
            else:
                raise Exception(f"Unexpected prediction status: {completed_prediction['status']}")
                
        except Exception as e:
            logger.error(f"Job {job_id} failed: {e}", exc_info=True)
            
            # Update job as failed
            SyncJobService.update_job(
                db, job_id,
                JobUpdate(
                    status=JobStatus.FAILED,
                    error_message=str(e)
                )
            )
            
            # Increment retry count
            job = SyncJobService.increment_retry_count(db, job_id)
            
            # Retry if under limit
            if job and job.retry_count < settings.max_retries:
                logger.info(f"Retrying job {job_id} (attempt {job.retry_count + 1})")
                raise self.retry(
                    countdown=int(settings.retry_backoff_base ** job.retry_count * 60),
                    max_retries=settings.max_retries
                )
            else:
                logger.error(f"Job {job_id} failed permanently after {settings.max_retries} retries")
                raise 