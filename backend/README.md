# Marketplace FastAPI Backend Service
---
## Setup
This example uses Anaconda. If you use venv, uv, or whatever just look it up. Use Python 3.13. If you use Anaconda, run this in your terminal.
```
conda create -n "cold-start" python=3.13
```
```
conda activate cold-start
```
```
pip install -r requirements.txt
```

## Backend Service Startup
Make sure you are in the **root folder** before you start this 
```
gunicorn -w 1 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 --max-requests 1000 --max-requests-jitter 50 --timeout 1200 backend.main:app

```

## Backend Service Testing (Localhost)
Navigate to the "Swagger Page" so you can test it, no need for Postman or Curl.
```
http://localhost:8000/api/docs
```