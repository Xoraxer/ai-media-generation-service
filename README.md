# AI Media Generation Service

A production-ready full-stack application for AI image generation using the Replicate API. Built with modern technologies and enterprise-level architecture patterns.

## 🏗️ Architecture Overview

This project demonstrates senior-level backend engineering with a complete full-stack implementation:

- **FastAPI Backend**: Async API with job queue management
- **React Frontend**: Modern SPA with TypeScript and Shadcn UI  
- **Celery Workers**: Background processing for image generation
- **Redis Queue**: Job queue and caching system
- **PostgreSQL**: Persistent data storage with migrations

## 🌟 Key Features

### Backend Highlights
- ✅ **Async-First Architecture**: Full async/await with AsyncPG
- ✅ **Production Job Queue**: Celery with Redis and retry logic
- ✅ **Real API Integration**: Replicate API for AI image generation
- ✅ **Robust Error Handling**: Exponential backoff and failure recovery
- ✅ **Type Safety**: Pydantic models and validation throughout
- ✅ **Clean Architecture**: Service layer pattern with separation of concerns
- ✅ **Database Migrations**: Alembic for schema versioning
- ✅ **Docker Ready**: Multi-service containerization

### Frontend Highlights
- ✅ **Modern React**: TypeScript, Vite, and component-based architecture
- ✅ **Real-time Updates**: Job status polling and live UI updates
- ✅ **Professional UI**: Shadcn UI components with responsive design
- ✅ **Error Handling**: Comprehensive error boundaries and user feedback

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended for easiest setup)
- **Node.js 18+** (for frontend development)
- **Python 3.9+** (for backend development)
- **Replicate API Token** ([Get one here](https://replicate.com/account/api-tokens))

### Option 1: Docker Setup (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd demo_project
   ```

2. **Set up environment variables:**
   ```bash
   # Backend environment
   cp media-generation-service/.env.example media-generation-service/.env
   
   # Frontend environment  
   cp media-generation-frontend/.env.example media-generation-frontend/.env
   
   # Edit the .env files with your Replicate API token
   ```

3. **Start all services:**
   ```bash
   cd media-generation-service
   docker-compose up --build
   ```

4. **Access the application:**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend:**
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

4. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start infrastructure (PostgreSQL + Redis):**
   ```bash
   docker-compose up -d db redis
   ```

6. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

7. **Start the API server:**
   ```bash
   uvicorn app.main:app --reload
   ```

8. **Start Celery worker (new terminal):**
   ```bash
   celery -A worker.celery_app worker --loglevel=info
   ```

#### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd media-generation-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Default values should work for local development
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 📋 Environment Configuration

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/media_generation

# Redis
REDIS_URL=redis://localhost:6379/0

# Replicate API (REQUIRED)
REPLICATE_API_TOKEN=your_replicate_token_here

# Application
DEBUG=True
PROJECT_NAME="Media Generation Service"
API_V1_PREFIX="/api/v1"
STORAGE_PATH="./storage"
MAX_RETRIES=3
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 🔧 API Endpoints

### Core Endpoints
- `POST /api/v1/generate` - Submit image generation job
- `GET /api/v1/status/{job_id}` - Get job status and results  
- `GET /api/v1/jobs` - List recent jobs
- `GET /api/v1/health` - Health check

### Documentation
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

### Frontend Architecture
```
src/
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── GenerateTab.tsx      # Image generation interface
│   ├── HistoryTab.tsx       # Job history and gallery
│   └── ArchitectureTab.tsx  # Technical documentation
├── lib/
│   ├── api.ts               # Type-safe API client
│   └── polling.ts           # Real-time job status polling
├── types/
│   └── api.ts               # TypeScript definitions
└── App.tsx                  # Main application
```

## 🔄 Data Flow

1. **User submits prompt** → Frontend sends POST to `/generate`
2. **Job created** → Database record with "pending" status
3. **Task queued** → Celery task enqueued to Redis
4. **Background processing** → Worker calls Replicate API
5. **Image generation** → AI model processes the request
6. **File storage** → Generated image downloaded locally
7. **Status update** → Job marked as "completed" with image path
8. **Real-time updates** → Frontend polls and displays result

## 🛠️ Development

### Code Quality
```bash
# Backend
cd media-generation-service
black app/                    # Code formatting
flake8 app/                   # Linting
mypy app/                     # Type checking

# Frontend  
cd media-generation-frontend
npm run lint                  # ESLint
npm run build                 # Type checking via tsc
```

### Testing
```bash
# Backend
pytest                        # Run tests
pytest --cov=app             # With coverage

# Frontend
npm test                      # Run tests
```

## 🚢 Deployment

### Docker Production
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up --build -d

# Check service health
docker-compose ps
```

### Environment Variables for Production
Ensure these are set in your production environment:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string  
- `REPLICATE_API_TOKEN` - Your Replicate API token
- `DEBUG=False` - Disable debug mode

## 📊 Monitoring

### Health Checks
- **API Health**: `GET /api/v1/health`
- **Service Status**: `docker-compose ps`
- **Logs**: `docker-compose logs -f [service]`

### Key Metrics
- Job processing times
- Queue depths
- Error rates
- API response times

## 🔍 Troubleshooting

### Common Issues

1. **"Connection refused" errors**
   - Ensure PostgreSQL and Redis are running
   - Check connection strings in .env

2. **Replicate API errors**
   - Verify your API token is correct
   - Check API rate limits

3. **Images not loading**
   - Ensure storage directory exists and is writable
   - Check static file serving configuration

### Debug Commands
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f web
docker-compose logs -f worker

# Database connection test
docker-compose exec web python -c "from app.core.database import async_engine; print('DB OK')"

# Redis connection test
docker-compose exec web python -c "import redis; r=redis.from_url('redis://redis:6379'); print(r.ping())"
```

## 🏆 Technical Highlights

This project demonstrates senior-level engineering practices:

### Architecture Patterns
- **Clean Architecture** with clear separation of concerns
- **Service Layer Pattern** for business logic encapsulation
- **Repository Pattern** with async/sync database access
- **Command Query Responsibility Segregation** (API vs Background tasks)

### Advanced Features
- **Dual Database Strategy**: Async for API, sync for Celery
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
- **Build Optimization**: Vite for fast frontend builds

## 📝 Assignment Requirements Met

✅ **API Layer**: FastAPI with POST /generate and GET /status endpoints  
✅ **Async Job Queue**: Celery with Redis and automatic retries  
✅ **Persistent Storage**: PostgreSQL + local file system  
✅ **Async Architecture**: Full async/await throughout  
✅ **Error Handling**: Comprehensive retry and failure logic  
✅ **Configuration**: Environment-based with secrets management  
✅ **Clean Architecture**: Service layer with separation of concerns  
✅ **Bonus - Pydantic**: Full type validation and schemas  
✅ **Bonus - Docker**: Complete containerization setup  
✅ **Bonus - Alembic**: Database migration management  
✅ **Bonus - Async ORM**: SQLAlchemy 2.0 with AsyncPG  

## 👨‍💻 Author

Built by Angel Rodriguez as a senior backend engineering demonstration project showcasing modern Python, FastAPI, and full-stack development practices.

## 📄 License

MIT License - See LICENSE file for details. 
