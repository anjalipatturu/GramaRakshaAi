FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm ci --only=production
RUN cd backend && npm ci --only=production
RUN cd frontend && npm ci --only=production

# Copy application code
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "backend/server.js"]
