import type { GenerateRequest, JobResponse, JobStatusResponse, ApiError } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.detail);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async generateImage(request: GenerateRequest): Promise<JobResponse> {
    return this.request<JobResponse>('/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    return this.request<JobStatusResponse>(`/status/${jobId}`);
  }

  async getRecentJobs(skip = 0, limit = 20): Promise<JobStatusResponse[]> {
    return this.request<JobStatusResponse[]>(`/jobs?skip=${skip}&limit=${limit}`);
  }

  async getCompletedJobs(skip = 0, limit = 20): Promise<JobStatusResponse[]> {
    return this.request<JobStatusResponse[]>(`/jobs/completed?skip=${skip}&limit=${limit}`);
  }

  getImageUrl(mediaPath: string): string {
    // If it's already a full URL (CDN), return as-is
    if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
      return mediaPath;
    }
    
    // For local paths, construct the full URL
    const filename = mediaPath.split('/').pop();
    return `${API_BASE_URL.replace('/api/v1', '')}/images/${filename}`;
  }
}

export const apiClient = new ApiClient(); 