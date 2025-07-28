import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GenerateTab } from '@/components/GenerateTab';
import { HistoryTab } from '@/components/HistoryTab';
import { ArchitectureTab } from '@/components/ArchitectureTab';
import { Wand2, History, Layers } from 'lucide-react';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleJobCreated = (_jobId: string) => {
    // Trigger a refresh of the history tab
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Image Generator
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Create stunning images with Stable Diffusion powered by Replicate API
          </p>
        </header>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="generate" className="flex items-center space-x-2">
              <Wand2 className="w-4 h-4" />
              <span>Generate</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger value="architecture" className="flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>Architecture</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-0">
            <GenerateTab onJobCreated={handleJobCreated} />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <HistoryTab refreshTrigger={refreshTrigger} />
          </TabsContent>

          <TabsContent value="architecture" className="mt-0">
            <ArchitectureTab />
          </TabsContent>
        </Tabs>

        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Built with React, TypeScript, FastAPI, Celery, and Redis
          </p>
          <p className="mt-1">
            Powered by{' '}
            <a 
              href="https://replicate.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Replicate API
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
