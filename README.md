# AI Media Generation Service

A production-ready full-stack application for AI image generation using the Replicate API. Built with modern technologies and enterprise-level architecture patterns for a Senior Backend Engineer assignment.

## ⚠️ SECURITY NOTICE - DEMO PROJECT ONLY

**This is a private demo project with committed `.env` files for easier testing and demonstration purposes.**

🔴 **WARNING**: The `.env` files in this repository contain production database credentials and are committed to version control. This is **NEVER** recommended for real production applications but is done here to simplify setup for demo purposes.

**Production services running on Render.com:**
- PostgreSQL Database: `dpg-d23r5rnfte5s73bfrdhg-a.oregon-postgres.render.com`
- Redis Cache: `red-ctsjhcq3esus73c0kp9g`

**In a real production environment, you should:**
- Never commit `.env` files to version control
- Use environment variables set directly in your deployment platform
- Use secrets management services
- Rotate credentials regularly

## 🏗️ Architecture Overview

This project demonstrates senior-level backend engineering with:

- **FastAPI Backend**: Async API with job queue management
- **React Frontend**: Modern SPA with TypeScript and real-time updates
- **Celery Workers**: Background processing for image generation
- **Redis Queue**: Job queue and caching system
- **PostgreSQL**: Persistent data storage with migrations

## 🌟 Key Features

### Backend Highlights
- ✅ **Async-First Architecture**: Full async/await with AsyncPG
- ✅ **Production Job Queue**: Celery with Redis and exponential backoff retry logic
- ✅ **Real API Integration**: Replicate API for AI image generation
- ✅ **Robust Error Handling**: Comprehensive retry and failure recovery
- ✅ **Type Safety**: Pydantic models and validation throughout
- ✅ **Clean Architecture**: Service layer pattern with separation of concerns
- ✅ **Database Migrations**: Alembic for schema versioning
- ✅ **Docker Ready**: Multi-service containerization

### Frontend Highlights
- ✅ **Modern React**: TypeScript, Vite, and component-based architecture
- ✅ **Real-time Updates**: Job status polling and live UI updates
- ✅ **Professional UI**: Shadcn UI components with responsive design

## 🚀 Quick Start (Docker - Recommended)

### Prerequisites
- **Docker & Docker Compose** 
- **Replicate API Token** ([Get one here](https://replicate.com/account/api-tokens))

### Setup & Run

```bash
# 1. Clone the repository
git clone <repository-url>
cd demo_project/media-generation-service

# 2. Environment variables are already configured
# The .env files are included in this repo for demo purposes
# Just add your Replicate API token to media-generation-service/.env:
# REPLICATE_API_TOKEN=your_actual_token_here

# 3. Start all services
docker compose up --build

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

That's it! The entire application stack will be running with:
- PostgreSQL database with auto-migrations
- Redis for job queue
- FastAPI backend with async workers
- React frontend with real-time updates

## 🔧 API Endpoints

### Core Endpoints
- `POST /api/v1/generate` - Submit image generation job
- `GET /api/v1/status/{job_id}` - Get job status and results  
- `GET /api/v1/jobs` - List recent jobs
- `GET /api/v1/health` - Health check

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🏛️ Technical Architecture

### Backend Architecture
```
app/
├── api/endpoints.py          # REST API routes
├── core/
│   ├── config.py            # Configuration management
│   └── database.py          # Database connections (async/sync)
├── models/
│   ├── job.py               # SQLAlchemy models
│   └── schemas.py           # Pydantic schemas
├── services/
│   ├── job_service.py       # Business logic (async/sync services)
│   └── media_client.py      # Replicate API client
├── tasks/
│   └── celery_tasks.py      # Background tasks
└── worker/
    └── celery_app.py        # Celery configuration
```

### Data Flow
1. **User submits prompt** → Frontend sends POST to `/generate`
2. **Job created** → Database record with "pending" status
3. **Task queued** → Celery task enqueued to Redis
4. **Background processing** → Worker calls Replicate API
5. **Image generation** → AI model processes the request
6. **CDN URL retrieval** → Generated image URL obtained from Replicate
7. **Status update** → Job marked as "completed" with CDN image URL
8. **Real-time updates** → Frontend polls and displays result from CDN

## 🛠️ Manual Development Setup (Optional)

If you prefer to run services individually:

<details>
<summary>Click to expand manual setup instructions</summary>

### Backend Setup
```bash
cd media-generation-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration

# Start infrastructure
docker compose up -d db redis

# Run migrations
alembic upgrade head

# Start API server
uvicorn app.main:app --reload

# Start Celery worker (new terminal)
celery -A worker.celery_app worker --loglevel=info
```

### Frontend Setup
```bash
cd media-generation-frontend
npm install
cp .env.example .env
npm run dev
```

</details>

## 📝 Assignment Requirements Met

✅ **API Layer**: FastAPI with POST /generate and GET /status endpoints  
✅ **Async Job Queue**: Celery with Redis and automatic retries (3 retries, exponential backoff)  
✅ **Persistent Storage**: PostgreSQL + local file system  
✅ **Async Architecture**: Full async/await throughout  
✅ **Error Handling**: Comprehensive retry and failure logic  
✅ **Configuration**: Environment-based with secrets management  
✅ **Clean Architecture**: Service layer with separation of concerns  

### Bonus Features Implemented
✅ **Pydantic**: Full type validation and schemas  
✅ **Docker**: Complete containerization setup  
✅ **Alembic**: Database migration management  
✅ **Async ORM**: SQLAlchemy 2.0 with AsyncPG  

## 🔍 Troubleshooting

### Common Issues

1. **"Connection refused" errors**
   - Ensure Docker is running
   - Wait for health checks to pass: `docker compose ps`

2. **Replicate API errors**
   - Verify your API token in `.env`
   - Check API rate limits

3. **Images not loading**
   - Verify Replicate API token is correct
   - Check that jobs completed successfully (status: "completed")
   - Images are served directly from Replicate's CDN - no local storage needed

### Debug Commands
```bash
# Check service status
docker compose ps

# View logs
docker compose logs -f web
docker compose logs -f worker

# Test API health
curl http://localhost:8000/api/v1/health

# Test image generation
curl -X POST http://localhost:8000/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a beautiful sunset", "model": "stability-ai/stable-diffusion-3"}'
```

## 🏆 Technical Highlights

This project demonstrates senior-level engineering practices:

### Architecture Patterns
- **Clean Architecture** with clear separation of concerns
- **Service Layer Pattern** for business logic encapsulation
- **Dual Database Strategy**: Async for API, sync for Celery workers
- **Command Query Responsibility Segregation** (API vs Background tasks)

### Advanced Features
- **Exponential Backoff Retry**: Robust failure handling
- **Type Safety**: Full Python + TypeScript coverage
- **Real-time Updates**: WebSocket-like polling experience
- **Production Logging**: Structured logging with context
- **Health Monitoring**: Comprehensive service health checks

### Performance Optimizations
- **Async I/O**: Non-blocking operations throughout
- **Connection Pooling**: Optimized database connections
- **Task Queuing**: Horizontal scaling ready
- **Static File Serving**: Efficient image delivery

## 🚀 Deploying to Render

This application is ready to deploy to Render.com as a web service. The database and Redis are already running on Render.

### Backend Deployment (Web Service)

1. **Create a new Web Service on Render:**
   - Connect your GitHub repository
   - Use the following settings:
     ```
     Name: media-generation-backend
     Environment: Docker
     Branch: main
     Root Directory: media-generation-service
     ```

2. **Environment Variables:**
   Set these in Render's environment variables section:
   ```
   DATABASE_URL=postgresql+asyncpg://mediadb_h6dy_user:Gb5dB0kKAzvEChD4hGJv6jgXRJR6ZNp9@dpg-d23r5rnfte5s73bfrdhg-a.oregon-postgres.render.com/mediadb_h6dy
   REDIS_URL=redis://red-d23vblqdbo4c7389c94g:6379
   REPLICATE_API_TOKEN=your_actual_replicate_token
   DEBUG=false
   PROJECT_NAME=Media Generation Service
   API_V1_PREFIX=/api/v1
   MAX_RETRIES=3
   RETRY_BACKOFF_BASE=2.0
   ALLOWED_ORIGINS=https://your-frontend-url.onrender.com,http://localhost:3000
   ```

3. **Docker Configuration:**
   The `Dockerfile` in `media-generation-service/` is already configured for Render deployment.
   
   **Note**: No volume mounts needed for image storage since images are served from Replicate's CDN.

### Frontend Deployment (Static Site)

1. **Create a new Static Site on Render:**
   - Connect your GitHub repository
   - Use the following settings:
     ```
     Name: media-generation-frontend
     Branch: main
     Root Directory: media-generation-frontend
     Build Command: npm install && npm run build
     Publish Directory: dist
     ```

2. **Environment Variables:**
   Set this in Render's environment variables:
   ```
   VITE_API_URL=https://your-backend-service.onrender.com/api/v1
   ```

### Background Worker Deployment

1. **Create a new Background Worker on Render:**
   - Connect your GitHub repository
   - Use the following settings:
     ```
     Name: media-generation-worker
     Environment: Docker
     Branch: main
     Root Directory: media-generation-service
     Docker Command: celery -A worker.celery_app worker --loglevel=info
     ```

2. **Environment Variables:**
   Use the same environment variables as the web service:
   ```
   DATABASE_URL=postgresql+asyncpg://mediadb_h6dy_user:Gb5dB0kKAzvEChD4hGJv6jgXRJR6ZNp9@dpg-d23r5rnfte5s73bfrdhg-a.oregon-postgres.render.com/mediadb_h6dy
   REDIS_URL=redis://red-d23vblqdbo4c7389c94g:6379
   REPLICATE_API_TOKEN=your_actual_replicate_token
   DEBUG=false
   PROJECT_NAME=Media Generation Service
   API_V1_PREFIX=/api/v1
   MAX_RETRIES=3
   RETRY_BACKOFF_BASE=2.0
   ```

### Production Notes

- The PostgreSQL and Redis instances are already running on Render
- Make sure to update `ALLOWED_ORIGINS` with your actual frontend URL
- Set `DEBUG=false` for production
- **Images are served from Replicate's CDN** - no local storage needed
- **Both Web Service and Background Worker need the same environment variables**
- Consider setting up health checks and monitoring
- Generated images are permanently available via Replicate's CDN URLs

---

**Built as a senior backend engineering demonstration project showcasing modern Python, FastAPI, and full-stack development practices.** 
