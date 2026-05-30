# ─────────────────────────────────────────────────────────────────────────────
# LinguaFlow — Backend Dockerfile (Django + DRF)
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.11-slim

# System metadata
LABEL maintainer="LinguaFlow Team"
LABEL description="Django REST API backend for LinguaFlow AI Learning Platform"

# Prevent Python from writing .pyc files / buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies needed for psycopg2 and other compiled packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
        curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project
COPY . .

# Expose Django dev / gunicorn port
EXPOSE 8000

# Default command: gunicorn for production.
# docker-compose overrides this with manage.py runserver for development.
CMD ["gunicorn", "linguaflow.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--timeout", "120", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
