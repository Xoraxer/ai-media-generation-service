import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Wand2, 
  Download, 
  RefreshCw, 
  Loader2, 
  Sparkles, 
  Lightbulb,
  Palette,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
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

  const getStatusIcon = () => {
    if (!currentJob) return null;
    
    switch (currentJob.status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header with gradient background */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-3xl blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <Wand2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Generate Images
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create stunning images from text prompts using Stable Diffusion
          </p>
        </div>
      </div>

      {/* Main Generation Card */}
      <Card className="max-w-3xl mx-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl border-2 border-primary/20">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl">New Generation</span>
          </CardTitle>
          <CardDescription className="text-base">
            Describe what you want to create and let AI generate it for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-3">
              <Label htmlFor="prompt" className="text-base font-semibold flex items-center space-x-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <span>Prompt</span>
              </Label>
              <Textarea
                id="prompt"
                placeholder="e.g., A majestic dragon flying over a medieval castle at sunset, highly detailed, fantasy art"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] border-2 border-primary/20 focus:border-primary/50 transition-colors text-base"
                required
                disabled={isLoading}
              />
            </div>

            {/* Model Input */}
            <div className="space-y-3">
              <Label htmlFor="model" className="text-base font-semibold flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>AI Model</span>
              </Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="stability-ai/stable-diffusion-3"
                className="border-2 border-primary/20 focus:border-primary/50 transition-colors text-base"
                required
                disabled={isLoading}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-700 dark:text-red-300 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Status Display */}
            {currentJob && (
              <div className={`p-4 rounded-lg border ${
                currentJob.status === 'completed' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800'
                  : currentJob.status === 'failed'
                  ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200 dark:border-red-800'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800'
              }`}>
                <div className="flex items-center space-x-3">
                  {getStatusIcon()}
                  <span className="font-medium">{getStatusMessage()}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isLoading || !prompt.trim()}
                className="flex-1 h-12 text-base bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
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
                  className="h-12 px-6 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  New Image
                </Button>
              )}
            </div>
          </form>

          {/* Generated Image Display */}
          {generatedImage && (
            <div className="mt-8 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl" />
                <div className="relative border-2 border-primary/20 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900">
                  <img
                    src={generatedImage}
                    alt="Generated image"
                    className="w-full h-auto transition-transform duration-300 hover:scale-[1.02]"
                    onError={() => setError('Failed to load generated image')}
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleDownload} 
                  variant="outline"
                  className="h-12 px-8 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Image
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-amber-800 dark:text-amber-200">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                <Lightbulb className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xl">Tips for Better Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: "🎯", tip: "Be specific and descriptive in your prompts" },
              { icon: "🎨", tip: "Include style keywords like \"photorealistic\", \"digital art\", or \"oil painting\"" },
              { icon: "💡", tip: "Mention lighting, composition, and mood for better results" },
              { icon: "✨", tip: "Use quality modifiers like \"highly detailed\", \"8k resolution\", \"masterpiece\"" }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                <span className="text-lg">{item.icon}</span>
                <span className="text-amber-700 dark:text-amber-300">{item.tip}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 