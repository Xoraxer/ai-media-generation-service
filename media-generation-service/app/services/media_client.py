import replicate
import requests
import os
from typing import Dict, Any, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class ReplicateClient:
    """Client for interacting with Replicate API."""
    
    def __init__(self):
        self.client = replicate.Client(api_token=settings.replicate_api_token)
    
    def create_prediction(self, model: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a prediction with Replicate API."""
        try:
            prediction = self.client.predictions.create(
                version=model,
                input=input_data
            )
            logger.info(f"Created prediction {prediction.id} for model {model}")
            return {
                "id": prediction.id,
                "status": prediction.status,
                "model": model,
                "input": input_data
            }
        except Exception as e:
            logger.error(f"Failed to create prediction: {e}")
            raise
    
    def get_prediction(self, prediction_id: str) -> Dict[str, Any]:
        """Get prediction status and results."""
        try:
            prediction = self.client.predictions.get(prediction_id)
            return {
                "id": prediction.id,
                "status": prediction.status,
                "output": prediction.output,
                "error": getattr(prediction, 'error', None)
            }
        except Exception as e:
            logger.error(f"Failed to get prediction {prediction_id}: {e}")
            raise
    
    def wait_for_prediction(self, prediction_id: str, timeout: int = 300) -> Dict[str, Any]:
        """Wait for prediction to complete."""
        try:
            prediction = self.client.predictions.get(prediction_id)
            prediction.wait()
            return {
                "id": prediction.id,
                "status": prediction.status,
                "output": prediction.output,
                "error": getattr(prediction, 'error', None)
            }
        except Exception as e:
            logger.error(f"Failed to wait for prediction {prediction_id}: {e}")
            raise
    
    def download_image(self, image_url: str, local_path: str) -> bool:
        """Download image from URL to local path."""
        try:
            # Ensure directory exists
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            
            response = requests.get(image_url, stream=True, timeout=30)
            response.raise_for_status()
            
            with open(local_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            logger.info(f"Downloaded image to {local_path}")
            return True
        except Exception as e:
            logger.error(f"Failed to download image from {image_url}: {e}")
            return False


# Global client instance
replicate_client = ReplicateClient() 