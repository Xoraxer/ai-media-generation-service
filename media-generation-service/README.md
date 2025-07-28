# Media Generation Service - Backend

A production-ready FastAPI backend for AI image generation using Replicate API, with Celery workers for background processing.

## Features

- **FastAPI**: Modern, fast web framework with automatic API documentation
- **Async Architecture**: Full async/await support for high performance
- **Background Processing**: Celery workers with Redis queue
- **Database**: PostgreSQL with SQLAlchemy 2.0 and Alembic migrations
- **Error Handling**: Comprehensive error handling with retry logic
- **Type Safety**: Full Pydantic validation and type hints
- **Production Ready**: Logging, health checks, and monitoring

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Replicate API token

### Development Setup

1. **Clone and navigate to the backend:**
   ```bash
   cd media-generation-service
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start infrastructure services:**
   ```bash
   docker-compose up -d
   ```

6. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

7. **Start the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload
   ```

8. **Start Celery worker (in another terminal):**
   ```bash
   celery -A worker.celery_app worker --loglevel=info
   ```

## API Endpoints

### Core Endpoints

- **POST /api/v1/generate** - Submit image generation job
- **GET /api/v1/status/{job_id}** - Get job status and results
- **GET /api/v1/jobs** - List recent jobs
- **GET /api/v1/health** - Health check

### Documentation

- **OpenAPI/Swagger**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Architecture

### Components

1. **FastAPI App** (`app/main.py`)
   - REST API endpoints
   - CORS configuration
   - Static file serving

2. **Database Layer** (`app/core/database.py`)
   - Async/sync session management
   - Connection pooling
   - Transaction handling

3. **Models** (`app/models/`)
   - SQLAlchemy models (`job.py`)
   - Pydantic schemas (`schemas.py`)

4. **Services** (`app/services/`)
   - Job management (`job_service.py`)
   - Replicate API client (`media_client.py`)

5. **Background Tasks** (`app/tasks/`)
   - Celery task definitions
   - Image generation workflow

6. **Worker** (`worker/celery_app.py`)
   - Celery configuration
   - Queue management

### Data Flow

1. **Job Submission**: Client sends POST to `/generate`
2. **Database**: Job created with "pending" status
3. **Queue**: Task enqueued to Celery
4. **Processing**: Worker picks up task, calls Replicate API
5. **Storage**: Generated image downloaded and stored locally
6. **Completion**: Job status updated to "completed" with image path

## Environment Variables

### Required

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/media_generation
REDIS_URL=redis://localhost:6379/0
REPLICATE_API_TOKEN=your_token_here
```

### Optional

```env
DEBUG=True
PROJECT_NAME="Media Generation Service"
API_V1_PREFIX="/api/v1"
STORAGE_PATH="./storage"
MAX_RETRIES=3
RETRY_BACKOFF_BASE=2.0
```

## Deployment

### Render Configuration

The service is configured for deployment on Render with separate app and worker services:

**App Service Environment:**
```
DATABASE_URL=postgresql+asyncpg://[credentials]
REDIS_URL=redis://[credentials]
REPLICATE_API_TOKEN=[token]
DEBUG=False
```

**Worker Service Environment:**
```
DATABASE_URL=postgresql://[credentials]  # Note: sync driver
REDIS_URL=redis://[credentials]
REPLICATE_API_TOKEN=[token]
DEBUG=False
```

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Monitoring

### Health Checks

- **API Health**: GET `/api/v1/health`
- **Database**: Connection pool monitoring
- **Redis**: Queue health monitoring
- **Worker**: Celery worker status

### Logging

Structured logging with different levels:
- **INFO**: Normal operations
- **ERROR**: Error conditions
- **DEBUG**: Detailed debugging (dev only)

### Metrics

- Job processing times
- Queue lengths
- Error rates
- API response times

## Development

### Code Structure

```
app/
├── api/endpoints.py          # REST API routes
├── core/
│   ├── config.py            # Configuration management
│   └── database.py          # Database connections
├── models/
│   ├── job.py               # SQLAlchemy models
│   └── schemas.py           # Pydantic schemas
├── services/
│   ├── job_service.py       # Business logic
│   └── media_client.py      # External API client
└── tasks/
    └── celery_tasks.py      # Background tasks
```

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test
pytest tests/test_api.py::test_generate_endpoint
```

### Code Quality

```bash
# Format code
black app/

# Lint code
flake8 app/

# Type checking
mypy app/
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL format
   - Ensure database exists

2. **Celery Worker Not Processing**
   - Check Redis connection
   - Verify REDIS_URL
   - Check worker logs

3. **Replicate API Errors**
   - Verify API token
   - Check API rate limits
   - Monitor API status

### Logs

```bash
# API logs
tail -f logs/api.log

# Worker logs
celery -A worker.celery_app events

# Database logs
tail -f logs/database.log
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

MIT License 