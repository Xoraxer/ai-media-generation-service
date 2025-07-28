from celery import current_task
from worker.celery_app import celery_app
from app.core.database import get_sync_db
from app.services.job_service import SyncJobService
from app.services.media_client import replicate_client
from app.models.schemas import JobUpdate, JobStatus
from app.core.config import settings
import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


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
            
            # Wait for prediction to complete
            logger.info(f"Waiting for prediction {prediction_id} to complete")
            completed_prediction = replicate_client.wait_for_prediction(prediction_id)
            
            if completed_prediction["status"] == "succeeded":
                output = completed_prediction["output"]
                
                # Handle different output formats
                image_url = None
                if isinstance(output, list) and len(output) > 0:
                    image_url = output[0]
                elif isinstance(output, str):
                    image_url = output
                
                if image_url:
                    # Generate local file path
                    filename = f"{job_id}.png"
                    local_path = os.path.join(settings.storage_path, "generated", filename)
                    
                    # Download image
                    if replicate_client.download_image(image_url, local_path):
                        # Update job as completed
                        SyncJobService.update_job(
                            db, job_id,
                            JobUpdate(
                                status=JobStatus.COMPLETED,
                                media_path=local_path
                            )
                        )
                        logger.info(f"Job {job_id} completed successfully")
                    else:
                        raise Exception("Failed to download generated image")
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