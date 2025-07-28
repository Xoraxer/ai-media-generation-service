import { apiClient } from './api';
import type { JobStatusResponse } from '@/types/api';

type JobStatusCallback = (job: JobStatusResponse) => void;
type JobCompleteCallback = (job: JobStatusResponse) => void;

interface PollingJob {
  jobId: string;
  intervalId: number;
  onStatusUpdate?: JobStatusCallback;
  onComplete?: JobCompleteCallback;
}

class JobPollingService {
  private activePolls = new Map<string, PollingJob>();
  private pollInterval = 3000; // 3 seconds

  /**
   * Start polling for a job's status
   */
  startPolling(
    jobId: string, 
    onStatusUpdate?: JobStatusCallback,
    onComplete?: JobCompleteCallback
  ): void {
    // Don't start polling if already polling this job
    if (this.activePolls.has(jobId)) {
      return;
    }

    const intervalId = window.setInterval(async () => {
      try {
        const job = await apiClient.getJobStatus(jobId);
        
        // Call status update callback
        if (onStatusUpdate) {
          onStatusUpdate(job);
        }

        // Check if job is complete
        if (job.status === 'completed' || job.status === 'failed') {
          this.stopPolling(jobId);
          
          // Call completion callback
          if (onComplete) {
            onComplete(job);
          }
        }
      } catch (error) {
        console.error(`Error polling job ${jobId}:`, error);
        // Stop polling on error to prevent spam
        this.stopPolling(jobId);
      }
    }, this.pollInterval);

    this.activePolls.set(jobId, {
      jobId,
      intervalId,
      onStatusUpdate,
      onComplete
    });

    console.log(`Started polling for job ${jobId}`);
  }

  /**
   * Stop polling for a specific job
   */
  stopPolling(jobId: string): void {
    const pollingJob = this.activePolls.get(jobId);
    if (pollingJob) {
      clearInterval(pollingJob.intervalId);
      this.activePolls.delete(jobId);
      console.log(`Stopped polling for job ${jobId}`);
    }
  }

  /**
   * Stop all active polling
   */
  stopAllPolling(): void {
    for (const [jobId] of this.activePolls) {
      this.stopPolling(jobId);
    }
  }

  /**
   * Check if a job is currently being polled
   */
  isPolling(jobId: string): boolean {
    return this.activePolls.has(jobId);
  }

  /**
   * Get the number of active polls
   */
  getActivePollCount(): number {
    return this.activePolls.size;
  }

  /**
   * Get all active job IDs being polled
   */
  getActiveJobIds(): string[] {
    return Array.from(this.activePolls.keys());
  }
}

// Export singleton instance
export const jobPollingService = new JobPollingService(); 