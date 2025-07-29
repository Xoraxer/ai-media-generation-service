# AI Media Generation Service

A full-stack application for AI image generation using the Replicate API, built with FastAPI, React, and modern async architecture for a Senior Backend Engineer assignment.

## 🌐 Live Demo

**Try the live application:** [https://media-generation-frontend.onrender.com](https://media-generation-frontend.onrender.com)

## 🏗️ Tech Stack

- **Backend**: FastAPI, Celery, PostgreSQL, Redis
- **Frontend**: React, TypeScript, Vite
- **AI**: Replicate API for image generation
- **Deployment**: Docker, Docker Compose

## 🚀 Local Setup

### Prerequisites
- Docker & Docker Compose
- [Replicate API Token](https://replicate.com/account/api-tokens)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/Xoraxer/ai-media-generation-service.git
cd ai-media-generation-service/media-generation-service

# Set up environment
cp .env.example .env
# Edit .env and add your Replicate API token

# Start all services
docker compose up --build


# Access the application
# Frontend: http://localhost:3000
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

**First startup takes ~5 minutes** for Docker images and frontend build.

## 📋 Assignment Requirements ✅

**API Layer (FastAPI)**
- ✅ POST /generate endpoint with async job queuing
- ✅ GET /status/{job_id} endpoint for job status
- ✅ Full async/await architecture

**Async Job Queue (Celery + Redis)**  
- ✅ Background job processing with Celery workers
- ✅ Redis message broker and result backend
- ✅ Automatic retries with exponential backoff (3 retries)
- ✅ Real Replicate API integration
- ✅ Persistent local image storage

**Persistent Storage**
- ✅ PostgreSQL for job metadata (status, timestamps, retries)
- ✅ Local file system for generated images
- ✅ Alembic database migrations

**Bonus Features**
- ✅ Typed Pydantic models and validation
- ✅ Complete Docker containerization  
- ✅ Async ORM (SQLAlchemy 2.0 + AsyncPG)

## 🔧 Troubleshooting

**Common Issues:**
- Ensure Docker is running: `docker compose ps`
- Check API token in `media-generation-service/.env`
- Frontend takes 2-3 minutes to build on first startup
- All services should show "healthy" status

**Quick Test:**
```bash
curl http://localhost:8000/api/v1/health
./test_setup.sh  # Automated setup verification
```

---

**Built by Angel Rodriguez as a senior backend engineering demonstration project showcasing modern Python, FastAPI, and full-stack development practices.**

 
