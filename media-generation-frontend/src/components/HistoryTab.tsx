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
  ExternalLink,
  ImageIcon,
  Calendar,
  Zap,
  RefreshCw,
  Sparkles
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
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'processing':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
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
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">Loading your creations...</h3>
          <p className="text-muted-foreground">Fetching your generation history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header with gradient background */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <History className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Generation History
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View all your generated images and their status
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="max-w-2xl mx-auto border-2 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200">Failed to load history</h3>
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={loadJobs}
                className="border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(() => {
        // All jobs are completed since we're using the completed endpoint
        const visibleJobs = jobs;
        
        return visibleJobs.length === 0 ? (
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 border-2 border-primary/20">
            <CardContent className="py-16 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-400 to-blue-500 rounded-2xl flex items-center justify-center">
                  <History className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">No generations yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Start by generating your first image in the Generate tab and it will appear here!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div>
            {/* Stats Bar */}
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                          <ImageIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Images</p>
                          <p className="text-2xl font-bold text-blue-600">{visibleJobs.length}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Completed</p>
                          <p className="text-2xl font-bold text-green-600">
                            {visibleJobs.filter(job => job.status === 'completed').length}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={loadJobs}
                      className="border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Images Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleJobs.map((job) => (
                <Card 
                  key={job.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-primary/10 hover:border-primary/20"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-muted rounded-lg">
                          {getStatusIcon(job.status)}
                        </div>
                        <span className={`text-sm font-semibold ${getStatusColor(job.status)}`}>
                          {getStatusText(job.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateRelative(job.created_at)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {job.status === 'completed' && job.media_path ? (
                      <div className="relative group">
                        <div className="aspect-square relative overflow-hidden rounded-xl bg-muted">
                          <img
                            src={apiClient.getImageUrl(job.media_path)}
                            alt={job.prompt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    ) : job.status === 'failed' ? (
                      <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-xl border-2 border-red-200 dark:border-red-800">
                        <div className="text-center p-4">
                          <XCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
                          <p className="text-sm font-medium text-red-600 dark:text-red-400">Generation failed</p>
                          {job.error_message && (
                            <p className="text-xs text-red-500 mt-2 line-clamp-2">
                              {job.error_message}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                        <div className="text-center">
                          <Loader2 className="w-12 h-12 mx-auto mb-3 text-blue-500 animate-spin" />
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Processing...</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold line-clamp-2 leading-relaxed">
                          {job.prompt}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {job.model.split(':')[0]}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {formatDate(job.created_at)}
                          </p>
                        </div>
                      </div>

                      {job.status === 'completed' && job.media_path && (
                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleImageDownload(job.media_path!, job.prompt)}
                            className="flex-1 h-9 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(apiClient.getImageUrl(job.media_path!), '_blank')}
                            className="h-9 px-3 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
} 