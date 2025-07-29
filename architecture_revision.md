# Backend System Architecture

**Asynchronous media generation service built with modern Python patterns for the Replicate API assignment**

## 🏗️ Core Architecture Decisions

### Async-First Design Pattern
**Why**: AI image generation involves 10-60 second external API calls that would block traditional sync servers.

**Implementation**: 
- FastAPI with full async/await throughout
- Non-blocking I/O for database and external API calls
- Efficient handling of concurrent requests

### Dual Database Strategy
**Problem**: Mixing async and sync database operations causes deadlocks and performance issues.

**Solution**: Separate database drivers for different contexts:
- **API Layer**: `AsyncJobService` with `postgresql+asyncpg://` for FastAPI endpoints
- **Background Tasks**: `SyncJobService` with `postgresql://` for Celery workers
- **Benefit**: Clean separation, no async/sync mixing bugs, optimal performance

### Clean Architecture Pattern
**Service Layer Separation**:
```python
AsyncJobService   # API operations (FastAPI)
SyncJobService    # Background operations (Celery)
MediaClient       # External API integration
```

**Benefits**: 
- Independent unit testing without framework dependencies
- Clear boundaries between concerns
- Easy to maintain and extend

## 🔄 Request Processing Flow

1. **API Request** → Client submits POST to `/api/v1/generate`
2. **Validation** → Pydantic schemas validate request data  
3. **Job Creation** → AsyncJobService creates database record
4. **Task Enqueue** → Celery task queued to Redis broker
5. **Background Processing** → Worker calls Replicate API
6. **Image Handling** → Smart storage based on environment:
   - **Development**: Download and serve locally
   - **Production**: Use direct CDN URLs (container storage limitations)
7. **Status Updates** → Job status persisted throughout lifecycle
8. **Client Polling** → Frontend polls `/api/v1/status/{job_id}` for updates

## 🛠️ Task Queue Design

### Intelligent Retry Strategy
- **Exponential backoff** with configurable limits (3 retries default)
- **Automatic failure recovery** with detailed error logging
- **Task isolation** in dedicated `media_generation` queue

### Production Considerations
- **Timeout handling**: 10-minute prediction timeout
- **Resource management**: Proper cleanup of failed jobs
- **Monitoring**: Comprehensive task status tracking

## 💾 Database Schema Design

**Flexible and Auditable**:
```sql
jobs:
  id (UUID)              # Distributed-system ready
  prompt (TEXT)          # User input
  model (STRING)         # AI model identifier  
  parameters (JSON)      # Flexible model parameters
  status (ENUM)          # pending/processing/completed/failed
  created_at/updated_at  # Audit trail
  retry_count (INT)      # Failure tracking
  media_path (STRING)    # Image location (local or CDN)
  error_message (TEXT)   # Debugging information
```

**Optimizations**:
- Indexed on `status` and `created_at` for efficient queries
- UUID primary keys for horizontal scaling
- JSON parameters for different AI models

## 🔌 External API Integration

### Replicate API Client
**Professional Integration Patterns**:
- **Encapsulation**: Dedicated `ReplicateClient` class
- **Reliability**: Built-in retry logic for network failures  
- **Resource Management**: Streaming downloads for large images
- **Timeout Handling**: Proper timeout management
- **Testability**: Easy to mock for comprehensive testing

### Environment-Aware Image Storage
```python
if DEBUG:
    # Development: Local storage with /api/v1/images/ serving
    download_and_save_locally(image_url)
else:
    # Production: Direct CDN URLs (container limitations)
    use_direct_cdn_url(image_url)
```

## 📊 Data Flow Architecture

### API Layer (FastAPI)
- **Async database operations** with connection pooling
- **Pydantic validation** for type safety
- **OpenAPI documentation** auto-generated
- **CORS configuration** for frontend integration

### Background Processing (Celery)
- **Redis broker** for reliable message queuing
- **Sync database operations** optimized for background tasks
- **Dedicated worker queues** for task isolation
- **Health monitoring** and error tracking

### Database Layer (PostgreSQL)
- **Alembic migrations** for schema versioning
- **Connection pooling** for performance
- **Async/sync driver optimization** for different use cases

## 🔧 Configuration Management

**Type-Safe Configuration**:
- **Pydantic Settings** with automatic validation
- **Environment variables** for secrets management
- **Multi-environment support** (dev/staging/production)
- **Runtime validation** on startup

## 🛡️ Production Reliability

### Multi-Layer Error Handling
- **API Layer**: HTTP status codes with detailed messages
- **Service Layer**: Business logic validation
- **Task Layer**: Retry logic with state persistence
- **Monitoring**: Structured logging for debugging

### Operational Excellence
- **Health checks** for all services
- **Docker containerization** for consistent deployment
- **Environment-based configuration** for different stages
- **Comprehensive logging** with request tracing

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **API** | FastAPI + AsyncPG | High-performance async API |
| **Queue** | Celery + Redis | Reliable background processing |
| **Database** | PostgreSQL 16 | ACID compliance and performance |
| **Validation** | Pydantic | Type safety and data validation |
| **Deployment** | Docker Compose | Containerized development |
| **AI Integration** | Replicate API | Professional AI model access |

## ✅ Assignment Requirements Met

- **✅ POST /generate endpoint** with async job enqueuing
- **✅ GET /status/{job_id}** endpoint for job status
- **✅ Celery + Redis** async job queue implementation
- **✅ Replicate API integration** with real API calls
- **✅ Automatic retries** with exponential backoff (3 retries)
- **✅ Persistent storage** of images (local filesystem)
- **✅ PostgreSQL database** for job metadata
- **✅ Async architecture** throughout the stack
- **✅ Error handling** with graceful failure management
- **✅ Configuration management** via environment variables
- **✅ Reusable components** (services, clients, models)
- **✅ Clean architecture** with separation of concerns

### Bonus Features Implemented
- **✅ Typed Pydantic models** and response validation
- **✅ Dockerized setup** with docker-compose
- **✅ Alembic migrations** for schema management
- **✅ Async ORM** with SQLAlchemy 2.0 + AsyncPG

**This architecture demonstrates solid backend engineering practices with focus on reliability and maintainability for AI workloads.**