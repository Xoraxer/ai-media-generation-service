import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  History,
  Download,
  ExternalLink 
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { JobStatusResponse } from '@/types/api';

interface HistoryTabProps {
  refreshTrigger?: number;
}

export function HistoryTab({ refreshTrigger }: HistoryTabProps) {
  const [jobs, setJobs] = useState<JobStatusResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Note: updateJob removed since we only show completed jobs (no real-time updates needed)

  const loadJobs = async () => {
    try {
      setError(null);
      // Load only completed jobs for history view
      const jobsData = await apiClient.getCompletedJobs(0, 50);
      
      // Remove duplicates by ID
      const uniqueJobs = jobsData.filter((job, index, self) => 
        self.findIndex(j => j.id === job.id) === index
      );
      
      setJobs(uniqueJobs);

      // No need to poll since we're only showing completed jobs
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [refreshTrigger]);

  // Note: No polling cleanup needed since we only show completed jobs

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing';
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleImageDownload = (mediaPath: string, _prompt: string) => {
    const imageUrl = apiClient.getImageUrl(mediaPath);
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
          <History className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Generation History</h2>
        <p className="text-muted-foreground">
          View all your generated images and their status
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadJobs}
            className="ml-2"
          >
            Retry
          </Button>
        </div>
      )}

      {(() => {
        // All jobs are completed since we're using the completed endpoint
        const visibleJobs = jobs;
        
        return visibleJobs.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No generations yet</h3>
              <p className="text-muted-foreground">
                Start by generating your first image in the Generate tab
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(job.status)}
                    <span className="text-sm font-medium">
                      {getStatusText(job.status)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(job.created_at)}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {job.status === 'completed' && job.media_path ? (
                  <div className="aspect-square relative overflow-hidden rounded-md bg-muted">
                    <img
                      src={apiClient.getImageUrl(job.media_path)}
                      alt={job.prompt}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                  </div>
                ) : job.status === 'failed' ? (
                  <div className="aspect-square flex items-center justify-center bg-destructive/10 rounded-md">
                    <div className="text-center">
                      <XCircle className="w-12 h-12 mx-auto mb-2 text-destructive" />
                      <p className="text-sm text-destructive">Generation failed</p>
                      {job.error_message && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {job.error_message}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square flex items-center justify-center bg-muted rounded-md">
                    <div className="text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Processing...</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium line-clamp-2">
                    {job.prompt}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Model: {job.model.split(':')[0]}
                  </p>
                </div>

                {job.status === 'completed' && job.media_path && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleImageDownload(job.media_path!, job.prompt)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(apiClient.getImageUrl(job.media_path!), '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        );
      })()}
    </div>
  );
} 