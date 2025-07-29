
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
  CheckCircle,
  Sparkles,
  Code,
  Globe,
  Rocket
} from 'lucide-react';

export function ArchitectureTab() {
  return (
    <div className="space-y-8 p-6">
      {/* Header with gradient background */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Layers className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Backend System Architecture
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Asynchronous media generation service built for the Replicate API assignment
          </p>
        </div>
      </div>

      {/* Assignment Requirements Met - Enhanced */}
      <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/40 dark:to-emerald-950/40 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-green-800 dark:text-green-200">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-xl">Assignment Requirements Fulfilled</span>
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/50 rounded-full">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">100%</span>
            </div>
          </CardTitle>
          <CardDescription className="text-base">
            Complete implementation of all core and bonus requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-md">
                  <Code className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="font-semibold text-green-800 dark:text-green-200">Core Requirements ✅</h4>
              </div>
              <div className="space-y-2">
                {[
                  "POST /generate endpoint with async job enqueuing",
                  "GET /status/{'{job_id}'} endpoint for job status",
                  "Celery + Redis async job queue implementation",
                  "Replicate API integration with real API calls",
                  "Automatic retries with exponential backoff (3 retries)",
                  "Persistent storage of images (local filesystem)",
                  "PostgreSQL database for job metadata",
                  "Async architecture throughout the stack",
                  "Error handling with graceful failure management",
                  "Configuration management via environment variables",
                  "Reusable components (services, clients, models)",
                  "Clean architecture with separation of concerns"
                ].map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 rounded-md hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-700 dark:text-green-300">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-md">
                  <Sparkles className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="font-semibold text-green-800 dark:text-green-200">Bonus Features ✅</h4>
              </div>
              <div className="space-y-2">
                {[
                  "Typed Pydantic models and response validation",
                  "Dockerized setup with docker-compose",
                  "Alembic migrations for schema management",
                  "Async ORM with SQLAlchemy 2.0 + AsyncPG"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 rounded-md hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-700 dark:text-green-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Architecture Principles - Enhanced */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl">Async-First Architecture Pattern</span>
          </CardTitle>
          <CardDescription className="text-base">
            Clean async implementation for AI workloads with long-running external API calls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Non-blocking I/O",
                description: "Critical for AI services with 10-60 second external API calls",
                color: "yellow"
              },
              {
                icon: Cpu,
                title: "Resource Efficiency",
                description: "Efficient handling of concurrent requests with proper async patterns",
                color: "blue"
              },
              {
                icon: Code,
                title: "Clean Implementation",
                description: "Well-structured codebase following async best practices",
                color: "green"
              }
            ].map((item, index) => (
              <div key={index} className={`p-6 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 dark:from-${item.color}-950/30 dark:to-${item.color}-900/30 rounded-xl border border-${item.color}-200 dark:border-${item.color}-800 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                <div className={`p-3 bg-${item.color}-100 dark:bg-${item.color}-900/50 rounded-lg w-fit mb-4`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                </div>
                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backend Design Choices - Enhanced Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Dual Database Strategy */}
        <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">Dual Database Driver Strategy</CardTitle>
            </div>
            <CardDescription className="text-base">
              Separate async/sync drivers for optimal performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-4 h-4 text-green-600" />
                  <p className="font-semibold">FastAPI Layer: <code className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-sm">postgresql+asyncpg://</code></p>
                </div>
                <p className="text-sm text-muted-foreground">Non-blocking database operations for API endpoints</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Server className="w-4 h-4 text-blue-600" />
                  <p className="font-semibold">Celery Workers: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-sm">postgresql://</code></p>
                </div>
                <p className="text-sm text-muted-foreground">Sync driver for background task processing</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <p className="font-semibold">Operational Safety</p>
                </div>
                <p className="text-sm text-muted-foreground">Prevents async/sync mixing bugs and eliminates deadlocks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clean Architecture Pattern */}
        <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">Clean Architecture Pattern</CardTitle>
            </div>
            <CardDescription className="text-base">
              Service layer separation for maintainability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Rocket className="w-4 h-4 text-purple-600" />
                  <p className="font-semibold">AsyncJobService</p>
                </div>
                <p className="text-sm text-muted-foreground">Handles FastAPI endpoints with async database sessions</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Settings className="w-4 h-4 text-indigo-600" />
                  <p className="font-semibold">SyncJobService</p>
                </div>
                <p className="text-sm text-muted-foreground">Manages Celery tasks with sync database sessions</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-gray-600" />
                  <p className="font-semibold">Benefits</p>
                </div>
                <p className="text-sm text-muted-foreground">Clear boundaries and independent testing capabilities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Queue Design */}
        <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl">Task Queue Design</CardTitle>
            </div>
            <CardDescription className="text-base">
              Celery configuration with intelligent retry logic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {[
                { label: "Retry Strategy", value: "Exponential backoff (3 retries max)", icon: "🔄" },
                { label: "Resource Management", value: "10min prediction timeout", icon: "⏱️" },
                { label: "Queue Isolation", value: "Dedicated media_generation queue", icon: "🎯" },
                { label: "Task Configuration", value: "Proper timeout and rate limiting", icon: "⚙️" },
                { label: "Monitoring", value: "Task tracking with status persistence", icon: "📊" },
                { label: "Environment Awareness", value: "Dev vs production optimizations", icon: "🌍" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <span className="font-medium text-sm">{item.label}:</span>
                    <span className="text-sm text-muted-foreground ml-1">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Handling */}
        <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl">Multi-Layer Error Handling</CardTitle>
            </div>
            <CardDescription className="text-base">
              Comprehensive error strategy with observability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {[
                { layer: "API Layer", description: "HTTP status codes with detailed messages", color: "blue" },
                { layer: "Service Layer", description: "Business logic validation & propagation", color: "green" },
                { layer: "Task Layer", description: "Retry logic with failure state persistence", color: "orange" },
                { layer: "Observability", description: "Structured logging for debugging", color: "purple" },
                { layer: "Recovery", description: "Automatic retry with exponential backoff", color: "red" }
              ].map((item, index) => (
                <div key={index} className={`p-3 bg-${item.color}-50/50 dark:bg-${item.color}-950/20 rounded-lg border border-${item.color}-200/50 dark:border-${item.color}-800/50`}>
                  <span className="font-medium text-sm">{item.layer}:</span>
                  <span className="text-sm text-muted-foreground ml-1">{item.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request Processing Flow - Enhanced */}
      <Card className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl">Request Processing Flow</span>
          </CardTitle>
          <CardDescription className="text-base">
            End-to-end data flow with error recovery patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Main Flow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { step: "1", title: "API Request", desc: "Client submits POST to /api/v1/generate", color: "blue" },
                { step: "2", title: "Validation", desc: "Pydantic schemas validate request data", color: "green" },
                { step: "3", title: "Job Creation", desc: "AsyncJobService creates database record", color: "purple" },
                { step: "4", title: "Task Enqueue", desc: "Celery task queued to Redis broker", color: "orange" },
                { step: "5", title: "Background Processing", desc: "Worker processes with Replicate API", color: "red" }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-xl">{item.step}</span>
                  </div>
                  <h4 className="font-semibold text-base mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Sub-processes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              {[
                { title: "External API", desc: "Replicate API call with retry logic", color: "green", icon: Globe },
                { title: "Smart Storage", desc: "Environment-aware: Local dev, CDN production", color: "blue", icon: Database },
                { title: "Status Update", desc: "Job marked as completed/failed", color: "purple", icon: CheckCircle },
                { title: "Client Polling", desc: "Frontend polls /api/v1/status/{'{job_id}'}", color: "orange", icon: Rocket }
              ].map((item, index) => (
                <div key={index} className={`text-center p-6 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 dark:from-${item.color}-950/30 dark:to-${item.color}-900/30 rounded-xl border border-${item.color}-200 dark:border-${item.color}-800 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                  <div className={`p-3 bg-${item.color}-100 dark:bg-${item.color}-900/50 rounded-lg w-fit mx-auto mb-3`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                  </div>
                  <h4 className={`font-semibold text-base text-${item.color}-700 dark:text-${item.color}-300 mb-2`}>{item.title}</h4>
                  <p className={`text-sm text-${item.color}-600 dark:text-${item.color}-400`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack - Enhanced */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl">Technology Stack</span>
          </CardTitle>
          <CardDescription className="text-base">
            Modern Python stack demonstrating solid backend engineering practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "API Layer",
                icon: Globe,
                color: "blue",
                items: ["FastAPI (Async)", "Pydantic Validation", "OpenAPI Docs", "CORS Configuration", "Error Handling"]
              },
              {
                title: "Background Processing",
                icon: Zap,
                color: "orange",
                items: ["Celery Workers", "Redis Broker", "Retry Logic", "Rate Limiting", "Task Monitoring"]
              },
              {
                title: "Data Layer",
                icon: Database,
                color: "green",
                items: ["PostgreSQL 16", "SQLAlchemy 2.0", "Async/Sync Drivers", "Alembic Migrations", "Connection Pooling"]
              },
              {
                title: "Operations",
                icon: Settings,
                color: "purple",
                items: ["Docker Compose", "Health Checks", "Structured Logging", "Environment Config", "Production Deploy"]
              }
            ].map((section, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 bg-${section.color}-100 dark:bg-${section.color}-900/50 rounded-lg`}>
                    <section.icon className={`w-5 h-5 text-${section.color}-600 dark:text-${section.color}-400`} />
                  </div>
                  <h4 className={`font-semibold text-lg text-${section.color}-700 dark:text-${section.color}-300`}>{section.title}</h4>
                </div>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <div className={`w-2 h-2 bg-${section.color}-500 rounded-full`} />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Architecture Summary - Enhanced */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-purple-50/50 to-pink-50/50 dark:from-primary/5 dark:via-purple-950/20 dark:to-pink-950/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center space-x-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Solid Backend Engineering Implementation
            </span>
          </CardTitle>
          <CardDescription className="text-center text-base max-w-3xl mx-auto">
            This architecture demonstrates solid backend engineering practices with focus on reliability and maintainability for AI workloads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                emoji: "🚀",
                title: "Performance",
                description: "Async-first architecture with non-blocking I/O and proper connection pooling",
                color: "blue"
              },
              {
                emoji: "🛡️",
                title: "Reliability",
                description: "Multi-layer error handling, automatic retries, and comprehensive monitoring",
                color: "green"
              },
              {
                emoji: "🔧",
                title: "Maintainability",
                description: "Clean architecture, service layer separation, and extensive type safety",
                color: "purple"
              }
            ].map((item, index) => (
              <div key={index} className={`text-center p-8 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 dark:from-${item.color}-950/30 dark:to-${item.color}-900/30 rounded-2xl border border-${item.color}-200 dark:border-${item.color}-800 hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h4 className={`font-bold text-xl mb-4 text-${item.color}-700 dark:text-${item.color}-300`}>{item.title}</h4>
                <p className={`text-${item.color}-600 dark:text-${item.color}-400 leading-relaxed`}>{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 