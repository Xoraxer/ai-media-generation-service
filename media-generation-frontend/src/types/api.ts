export interface GenerateRequest {
  prompt: string;
  model: string;
  parameters?: Record<string, any>;
}

export interface JobResponse {
  job_id: string;
  status: string;
  message: string;
}

export interface JobStatusResponse {
  id: string;
  prompt: string;
  model: string;
  parameters: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  media_path?: string;
  error_message?: string;
}

export interface ApiError {
  detail: string;
} 