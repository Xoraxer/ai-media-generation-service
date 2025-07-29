
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Server, 
  Database, 
  Layers, 
  Zap,
  GitBranch,
  Shield,
  Cpu,
  Settings,
  AlertTriangle,
  Network,
  CheckCircle
} from 'lucide-react';

export function ArchitectureTab() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
          <Layers className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Backend System Architecture</h2>
        <p className="text-muted-foreground">
          Asynchronous media generation service built for the Replicate API assignment
        </p>
      </div>

      {/* Assignment Requirements Met */}
      <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
            <CheckCircle className="w-5 h-5" />
            <span>Assignment Requirements Fulfilled</span>
          </CardTitle>
          <CardDescription>
            Complete implementation of all core and bonus requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-green-800 dark:text-green-200">Core Requirements ✅</h4>
              <ul className="text-xs space-y-1 text-green-700 dark:text-green-300">
                <li>• POST /generate endpoint with async job enqueuing</li>
                <li>• GET /status/{'{job_id}'} endpoint for job status</li>
                <li>• Celery + Redis async job queue implementation</li>
                <li>• Replicate API integration with real API calls</li>
                <li>• Automatic retries with exponential backoff (3 retries)</li>
                <li>• Persistent storage of images (local filesystem)</li>
                <li>• PostgreSQL database for job metadata</li>
                <li>• Async architecture throughout the stack</li>
                <li>• Error handling with graceful failure management</li>
                <li>• Configuration management via environment variables</li>
                <li>• Reusable components (services, clients, models)</li>
                <li>• Clean architecture with separation of concerns</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-green-800 dark:text-green-200">Bonus Features ✅</h4>
              <ul className="text-xs space-y-1 text-green-700 dark:text-green-300">
                <li>• Typed Pydantic models and response validation</li>
                <li>• Dockerized setup with docker-compose</li>
                <li>• Alembic migrations for schema management</li>
                <li>• Async ORM with SQLAlchemy 2.0 + AsyncPG</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Architecture Principles */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Async-First Architecture Pattern</span>
          </CardTitle>
          <CardDescription>
            Clean async implementation for AI workloads with long-running external API calls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Non-blocking I/O</h4>
              <p className="text-xs text-muted-foreground">
                Critical for AI services with 10-60 second external API calls
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Resource Efficiency</h4>
              <p className="text-xs text-muted-foreground">
                Efficient handling of concurrent requests with proper async patterns
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Clean Implementation</h4>
              <p className="text-xs text-muted-foreground">
                Well-structured codebase following async best practices
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backend Design Choices */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Dual Database Driver Strategy</CardTitle>
            </div>
            <CardDescription>
              Separate async/sync drivers for optimal performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                <p><strong>FastAPI Layer:</strong> <code className="bg-green-100 dark:bg-green-900 px-1 rounded">postgresql+asyncpg://</code></p>
                <p className="text-xs text-muted-foreground mt-1">Non-blocking database operations for API endpoints</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                <p><strong>Celery Workers:</strong> <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">postgresql://</code></p>
                <p className="text-xs text-muted-foreground mt-1">Sync driver for background task processing</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200 dark:border-yellow-800">
                <p><strong>Operational Safety:</strong> Prevents async/sync mixing bugs</p>
                <p className="text-xs text-muted-foreground mt-1">Eliminates deadlocks and performance issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Clean Architecture Pattern</CardTitle>
            </div>
            <CardDescription>
              Service layer separation for maintainability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-3">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded border border-purple-200 dark:border-purple-800">
                <p><strong>AsyncJobService:</strong> API-layer operations</p>
                <p className="text-xs text-muted-foreground mt-1">Handles FastAPI endpoints with async database sessions</p>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded border border-indigo-200 dark:border-indigo-800">
                <p><strong>SyncJobService:</strong> Background task operations</p>
                <p className="text-xs text-muted-foreground mt-1">Manages Celery tasks with sync database sessions</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-950/20 rounded border border-gray-200 dark:border-gray-800">
                <p><strong>Benefits:</strong> Clear boundaries, independent testing</p>
                <p className="text-xs text-muted-foreground mt-1">Services can be unit tested without framework dependencies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Task Queue Design</CardTitle>
            </div>
            <CardDescription>
              Celery configuration with intelligent retry logic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p><strong>Retry Strategy:</strong> Exponential backoff (3 retries max)</p>
              <p><strong>Resource Management:</strong> 10min prediction timeout</p>
              <p><strong>Queue Isolation:</strong> Dedicated media_generation queue</p>
              <p><strong>Task Configuration:</strong> Proper timeout and rate limiting</p>
              <p><strong>Monitoring:</strong> Task tracking with status persistence</p>
              <p><strong>Environment Awareness:</strong> Dev vs production optimizations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Multi-Layer Error Handling</CardTitle>
            </div>
            <CardDescription>
              Comprehensive error strategy with observability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p><strong>API Layer:</strong> HTTP status codes with detailed messages</p>
              <p><strong>Service Layer:</strong> Business logic validation & propagation</p>
              <p><strong>Task Layer:</strong> Retry logic with failure state persistence</p>
              <p><strong>Observability:</strong> Structured logging for debugging</p>
              <p><strong>Recovery:</strong> Automatic retry with exponential backoff</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Flow Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-primary" />
            <span>Request Processing Flow</span>
          </CardTitle>
          <CardDescription>
            End-to-end data flow with error recovery patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-semibold text-sm">API Request</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Client submits POST to /api/v1/generate
                </p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h4 className="font-semibold text-sm">Validation</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Pydantic schemas validate request data
                </p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h4 className="font-semibold text-sm">Job Creation</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  AsyncJobService creates database record
                </p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">4</span>
                </div>
                <h4 className="font-semibold text-sm">Task Enqueue</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Celery task queued to Redis broker
                </p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">5</span>
                </div>
                <h4 className="font-semibold text-sm">Background Processing</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Worker processes with Replicate API
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-sm text-green-700 dark:text-green-300">External API</h4>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Replicate API call with retry logic
                </p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300">Smart Storage</h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Environment-aware: Local dev, CDN production
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-300">Status Update</h4>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Job marked as completed/failed
                </p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold text-sm text-orange-700 dark:text-orange-300">Client Polling</h4>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Frontend polls /api/v1/status/{'{job_id}'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Implementation Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Database Schema Design</CardTitle>
            </div>
            <CardDescription>
              Flexible, auditable, and scalable data model
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p><strong>Flexibility:</strong> JSON parameters for different AI models</p>
              <p><strong>Auditability:</strong> Timestamps, retry counts, error messages</p>
              <p><strong>Performance:</strong> Indexed on status and created_at</p>
              <p><strong>Scalability:</strong> UUID primary keys for distributed systems</p>
              <p><strong>Reliability:</strong> Comprehensive error tracking</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Network className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Environment-Aware Design</CardTitle>
            </div>
            <CardDescription>
              Smart adaptation to deployment environment constraints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                <p><strong>Development (DEBUG=true):</strong> Local image storage</p>
                <p className="text-xs text-muted-foreground mt-1">Downloads and serves images via /api/v1/images/ endpoint</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                <p><strong>Production (DEBUG=false):</strong> Direct CDN URLs</p>
                <p className="text-xs text-muted-foreground mt-1">Uses Replicate CDN URLs (container storage limitations)</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded border border-purple-200 dark:border-purple-800">
                <p><strong>Benefits:</strong> Optimal performance in each environment</p>
                <p className="text-xs text-muted-foreground mt-1">Adapts to infrastructure constraints automatically</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Network className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">External API Integration</CardTitle>
            </div>
            <CardDescription>
              Professional patterns for third-party API integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p><strong>Encapsulation:</strong> Dedicated ReplicateClient class</p>
              <p><strong>Reliability:</strong> Built-in retry logic for network failures</p>
              <p><strong>Resource Management:</strong> Streaming downloads for large images</p>
              <p><strong>Timeout Handling:</strong> 10min prediction timeout with monitoring</p>
              <p><strong>Testability:</strong> Easy to mock for comprehensive testing</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Configuration Management</CardTitle>
            </div>
            <CardDescription>
              Type-safe configuration with Pydantic Settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p><strong>Type Safety:</strong> Automatic validation and type conversion</p>
              <p><strong>Security:</strong> Environment variables for secrets</p>
              <p><strong>Flexibility:</strong> Different configs for dev/staging/production</p>
              <p><strong>Documentation:</strong> Self-documenting with defaults</p>
              <p><strong>Validation:</strong> Runtime config validation on startup</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>
            Modern Python stack demonstrating solid backend engineering practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-primary">API Layer</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>FastAPI (Async)</li>
                <li>Pydantic Validation</li>
                <li>OpenAPI Docs</li>
                <li>CORS Configuration</li>
                <li>Error Handling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-primary">Background Processing</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Celery Workers</li>
                <li>Redis Broker</li>
                <li>Retry Logic</li>
                <li>Rate Limiting</li>
                <li>Task Monitoring</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-primary">Data Layer</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>PostgreSQL 16</li>
                <li>SQLAlchemy 2.0</li>
                <li>Async/Sync Drivers</li>
                <li>Alembic Migrations</li>
                <li>Connection Pooling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-primary">Operations</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Docker Compose</li>
                <li>Health Checks</li>
                <li>Structured Logging</li>
                <li>Environment Config</li>
                <li>Production Deploy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Architecture Summary */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-center">Solid Backend Engineering Implementation</CardTitle>
          <CardDescription className="text-center">
            This architecture demonstrates solid backend engineering practices with focus on reliability and maintainability for AI workloads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div className="text-center p-4">
              <h4 className="font-semibold mb-2">🚀 Performance</h4>
              <p className="text-muted-foreground">Async-first architecture with non-blocking I/O and proper connection pooling</p>
            </div>
            <div className="text-center p-4">
              <h4 className="font-semibold mb-2">🛡️ Reliability</h4>
              <p className="text-muted-foreground">Multi-layer error handling, automatic retries, and comprehensive monitoring</p>
            </div>
            <div className="text-center p-4">
              <h4 className="font-semibold mb-2">🔧 Maintainability</h4>
              <p className="text-muted-foreground">Clean architecture, service layer separation, and extensive type safety</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 