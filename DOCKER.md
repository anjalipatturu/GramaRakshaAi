# Docker Deployment Guide 🐳

## Quick Start with Docker

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### 1. Setup Environment Variables

```bash
# Copy the example environment file
cp .env.docker.example .env

# Edit the .env file with your values
nano .env
```

### 2. Start with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **MongoDB**: localhost:27017

## Individual Service Deployment

### Backend Only

```bash
# Build backend image
docker build -f Dockerfile.backend -t gramaraksha-backend .

# Run backend container
docker run -d \
  --name gramaraksha-backend \
  -p 5000:5000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-jwt-secret" \
  gramaraksha-backend
```

### Frontend Only

```bash
# Build frontend image
docker build -f Dockerfile.frontend -t gramaraksha-frontend .

# Run frontend container
docker run -d \
  --name gramaraksha-frontend \
  -p 3000:80 \
  -e REACT_APP_API_URL="http://localhost:5000/api" \
  gramaraksha-frontend
```

## Docker Commands Cheatsheet

### Container Management

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop a container
docker stop <container-id>

# Start a container
docker start <container-id>

# Restart a container
docker restart <container-id>

# Remove a container
docker rm <container-id>

# View container logs
docker logs <container-id>
docker logs -f <container-id>  # Follow logs

# Execute command in container
docker exec -it <container-id> sh
```

### Image Management

```bash
# List images
docker images

# Remove an image
docker rmi <image-id>

# Remove unused images
docker image prune
```

### Docker Compose Commands

```bash
# Start services
docker-compose up
docker-compose up -d  # Detached mode

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Rebuild services
docker-compose build
docker-compose up -d --build

# View logs
docker-compose logs
docker-compose logs -f backend  # Specific service

# Scale services
docker-compose up -d --scale backend=3

# Execute command in service
docker-compose exec backend sh
```

### Database Management

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123

# Backup database
docker-compose exec mongodb mongodump --out=/backup

# Restore database
docker-compose exec mongodb mongorestore /backup

# Copy backup from container
docker cp gramaraksha-mongodb:/backup ./backup
```

## Production Deployment

### 1. Build for Production

```bash
# Set production environment
export NODE_ENV=production

# Build services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
```

### 2. Deploy with Secrets

Create a `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    environment:
      NODE_ENV: production
    secrets:
      - jwt_secret
      - db_password

  mongodb:
    environment:
      MONGO_INITDB_ROOT_PASSWORD_FILE: /run/secrets/db_password

secrets:
  jwt_secret:
    external: true
  db_password:
    external: true
```

### 3. Create Docker Secrets

```bash
echo "your-jwt-secret" | docker secret create jwt_secret -
echo "your-db-password" | docker secret create db_password -
```

### 4. Deploy Stack

```bash
docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml gramaraksha
```

## Health Checks

### Container Health Status

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' gramaraksha-backend

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' gramaraksha-backend
```

### Add Health Checks to Dockerfile

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node healthcheck.js || exit 1
```

## Troubleshooting

### Container Won't Start

```bash
# View container logs
docker logs <container-id>

# Check container status
docker ps -a

# Inspect container
docker inspect <container-id>
```

### Network Issues

```bash
# List networks
docker network ls

# Inspect network
docker network inspect gramaraksha_gramaraksha-network

# Test connectivity
docker-compose exec backend ping mongodb
```

### Volume Issues

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect gramaraksha_mongodb_data

# Remove volume (WARNING: This deletes data)
docker volume rm gramaraksha_mongodb_data
```

### Clean Up Everything

```bash
# Stop and remove all containers
docker-compose down

# Remove volumes
docker-compose down -v

# Remove all unused resources
docker system prune -a
```

## Monitoring

### Resource Usage

```bash
# View resource usage
docker stats

# View specific container stats
docker stats gramaraksha-backend
```

### Logs Management

```bash
# View logs with timestamp
docker-compose logs -t

# View last 100 lines
docker-compose logs --tail=100

# View logs since timestamp
docker-compose logs --since 2024-01-01T00:00:00
```

## Updating Deployment

```bash
# Pull latest images
docker-compose pull

# Recreate containers
docker-compose up -d --force-recreate

# Or rebuild from source
git pull origin main
docker-compose build
docker-compose up -d
```

## Backup Strategy

### Automated Backups

Create a cron job:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/gramaraksha-ai && ./backup.sh
```

Create `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# Backup database
docker-compose exec -T mongodb mongodump --archive > "$BACKUP_DIR/db.archive"

# Backup uploads
docker cp gramaraksha-backend:/app/uploads "$BACKUP_DIR/"

# Keep only last 7 backups
find /backups -type d -mtime +7 -exec rm -rf {} \;
```

## Security Best Practices

1. **Never commit `.env` files**
2. **Use Docker secrets for sensitive data**
3. **Run containers as non-root user**
4. **Limit container resources**
5. **Keep images updated**
6. **Use multi-stage builds**
7. **Scan images for vulnerabilities**

```bash
# Scan image for vulnerabilities
docker scan gramaraksha-backend
```

## Performance Optimization

### Resource Limits

Add to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Optimize Build Time

```dockerfile
# Use .dockerignore
# Order layers from least to most frequently changing
# Use build cache
# Multi-stage builds for smaller images
```

---

**Docker deployment configured! 🎉**

Your GramaRaksha AI platform is now containerized and ready for deployment anywhere Docker runs!
