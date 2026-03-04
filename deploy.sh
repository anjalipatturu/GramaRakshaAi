#!/bin/bash

# GramaRaksha AI Deployment Script
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e  # Exit on error

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$TIMESTAMP"

echo "🚀 Starting GramaRaksha AI Deployment"
echo "📅 Timestamp: $TIMESTAMP"
echo "🌍 Environment: $ENVIRONMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo ""
echo "🔍 Checking prerequisites..."
if ! command_exists node; then
    print_error "Node.js is not installed"
    exit 1
fi
print_success "Node.js $(node --version)"

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm $(npm --version)"

if ! command_exists git; then
    print_error "Git is not installed"
    exit 1
fi
print_success "Git $(git --version)"

if ! command_exists pm2; then
    print_warning "PM2 is not installed. Installing..."
    sudo npm install -g pm2
fi
print_success "PM2 $(pm2 --version)"

# Create backup directory
echo ""
echo "💾 Creating backup directory..."
mkdir -p "$BACKUP_DIR"
print_success "Backup directory created: $BACKUP_DIR"

# Backup current deployment
echo ""
echo "📦 Backing up current deployment..."
if [ -f "backend/.env" ]; then
    cp backend/.env "$BACKUP_DIR/backend.env"
    print_success "Backend .env backed up"
fi
if [ -f "frontend/.env.production" ]; then
    cp frontend/.env.production "$BACKUP_DIR/frontend.env"
    print_success "Frontend .env backed up"
fi

# Pull latest changes
echo ""
echo "📥 Pulling latest code from Git..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_warning "Current branch: $CURRENT_BRANCH"
git fetch origin
git pull origin $CURRENT_BRANCH
print_success "Code updated successfully"

# Backend deployment
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 BACKEND DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd backend

# Install dependencies
echo ""
echo "📦 Installing backend dependencies..."
npm ci --only=production
print_success "Backend dependencies installed"

# Run database migrations (if exists)
if [ -f "migrations/migrate.js" ]; then
    echo ""
    echo "🗄️ Running database migrations..."
    npm run migrate
    print_success "Migrations completed"
fi

# Restart backend service
echo ""
echo "🔄 Restarting backend service..."
if pm2 describe gramaraksha-backend > /dev/null 2>&1; then
    pm2 restart gramaraksha-backend --update-env
    print_success "Backend service restarted"
else
    pm2 start server.js --name gramaraksha-backend -i max --env production
    pm2 save
    print_success "Backend service started"
fi

cd ..

# Frontend deployment
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 FRONTEND DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd frontend

# Install dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm ci --only=production
print_success "Frontend dependencies installed"

# Build frontend
echo ""
echo "🏗️ Building frontend..."
npm run build
print_success "Frontend built successfully"

# Check if using serve for production
if pm2 describe gramaraksha-frontend > /dev/null 2>&1; then
    pm2 restart gramaraksha-frontend
    print_success "Frontend service restarted"
else
    # Install serve if not present
    if ! command_exists serve; then
        npm install -g serve
    fi
    pm2 serve build 3000 --name gramaraksha-frontend --spa
    pm2 save
    print_success "Frontend service started"
fi

cd ..

# Reload Nginx
echo ""
echo "🔄 Reloading Nginx..."
if command_exists nginx; then
    sudo nginx -t && sudo systemctl reload nginx
    print_success "Nginx reloaded"
else
    print_warning "Nginx not found, skipping reload"
fi

# Run health checks
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏥 HEALTH CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sleep 5  # Wait for services to start

# Check backend health
echo ""
echo "Checking backend health..."
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)
if [ "$BACKEND_HEALTH" = "200" ]; then
    print_success "Backend is healthy (HTTP $BACKEND_HEALTH)"
else
    print_error "Backend health check failed (HTTP $BACKEND_HEALTH)"
fi

# Check frontend
echo "Checking frontend..."
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_HEALTH" = "200" ]; then
    print_success "Frontend is healthy (HTTP $FRONTEND_HEALTH)"
else
    print_error "Frontend health check failed (HTTP $FRONTEND_HEALTH)"
fi

# Display PM2 status
echo ""
echo "📊 PM2 Process Status:"
pm2 list

# Display logs location
echo ""
echo "📝 Logs can be viewed at:"
echo "   Backend: pm2 logs gramaraksha-backend"
echo "   Frontend: pm2 logs gramaraksha-frontend"
echo "   All: pm2 logs"

# Deployment summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📌 Deployment Summary:"
echo "   Environment: $ENVIRONMENT"
echo "   Timestamp: $TIMESTAMP"
echo "   Branch: $CURRENT_BRANCH"
echo "   Backup: $BACKUP_DIR"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Health Check: http://localhost:5000/health"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs: pm2 logs"
echo "   Restart all: pm2 restart all"
echo "   Stop all: pm2 stop all"
echo "   Monitor: pm2 monit"
echo ""

exit 0
