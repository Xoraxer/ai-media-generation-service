import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Download, RefreshCw, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { jobPollingService } from '@/lib/polling';
import type { GenerateRequest, JobStatusResponse } from '@/types/api';

interface GenerateTabProps {
  onJobCreated: (jobId: string) => void;
}

export function GenerateTab({ onJobCreated }: GenerateTabProps) {
  const [prompt, setPrompt] = useState('');
  // Using stability-ai/stable-diffusion-3 as it's currently working
  const [model, setModel] = useState('stability-ai/stable-diffusion-3');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentJob, setCurrentJob] = useState<JobStatusResponse | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentJob(null);
    setGeneratedImage(null);

    try {
      const request: GenerateRequest = {
        prompt: prompt.trim(),
        model,
        parameters: {}
      };

      const response = await apiClient.generateImage(request);
      
      // Start polling for job status updates
      jobPollingService.startPolling(
        response.job_id,
        (job) => {
          console.log(`Job ${job.id} status: ${job.status}`);
          setCurrentJob(job);
          
          // If job completed successfully, set the generated image
          if (job.status === 'completed' && job.media_path) {
            const imageUrl = apiClient.getImageUrl(job.media_path);
            setGeneratedImage(imageUrl);
          }
        },
        (job) => {
          console.log(`Job ${job.id} completed with status: ${job.status}`);
          setCurrentJob(job);
          setIsLoading(false);
          
          // If job completed successfully, set the generated image
          if (job.status === 'completed' && job.media_path) {
            const imageUrl = apiClient.getImageUrl(job.media_path);
            setGeneratedImage(imageUrl);
          }
          
          // Trigger history refresh when job completes
          onJobCreated(job.id);
        }
      );
      
      // Immediately trigger history refresh to show the new pending job
      onJobCreated(response.job_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      setIsLoading(false);
    }
  };

  const handleGenerateNew = () => {
    setPrompt('');
    setCurrentJob(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusMessage = () => {
    if (!currentJob) return '';
    
    switch (currentJob.status) {
      case 'pending':
        return 'Job queued for processing...';
      case 'processing':
        return 'Generating your image...';
      case 'completed':
        return 'Image generated successfully!';
      case 'failed':
        return `Generation failed: ${currentJob.error_message}`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
          <Wand2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Generate Images</h2>
        <p className="text-muted-foreground">
          Create stunning images from text prompts using Stable Diffusion
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>New Generation</CardTitle>
          <CardDescription>
            Describe what you want to create and let AI generate it for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="e.g., A majestic dragon flying over a medieval castle at sunset, highly detailed, fantasy art"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="stability-ai/stable-diffusion-3"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            {currentJob && (
              <div className="p-3 text-sm bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{getStatusMessage()}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isLoading || !prompt.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
              
              {(generatedImage || currentJob) && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleGenerateNew}
                  disabled={isLoading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Image
                </Button>
              )}
            </div>
          </form>

          {/* Generated Image Display */}
          {generatedImage && (
            <div className="mt-6 space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={generatedImage}
                  alt="Generated image"
                  className="w-full h-auto"
                  onError={() => setError('Failed to load generated image')}
                />
              </div>
              
              <div className="flex justify-center">
                <Button onClick={handleDownload} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Be specific and descriptive in your prompts</p>
            <p>• Include style keywords like "photorealistic", "digital art", or "oil painting"</p>
            <p>• Mention lighting, composition, and mood for better results</p>
            <p>• Use quality modifiers like "highly detailed", "8k resolution", "masterpiece"</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 