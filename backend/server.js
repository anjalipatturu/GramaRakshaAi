const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const screeningRoutes = require('./routes/screening.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes');
const villageRoutes = require('./routes/village.routes');

// Import middleware
const { errorHandler } = require('./middleware/error.middleware');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend build
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/screenings', screeningRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/villages', villageRoutes);

// Health check
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    message: 'GramaRaksha AI Backend Running',
    environment: process.env.NODE_ENV || 'development',
    mongodb: {
      configured: !!process.env.MONGODB_URI,
      connected: mongoose.connection.readyState === 1
    },
    ai: {
      offlineMode: process.env.OFFLINE_MODE === 'true',
      apiKeyConfigured: !!process.env.GEMINI_API_KEY
    },
    jwt: {
      secretConfigured: !!process.env.JWT_SECRET
    }
  };

  // Return error status if critical services are not configured
  if (!health.mongodb.configured && process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      ...health,
      status: 'ERROR',
      message: 'MongoDB not configured for production'
    });
  }

  res.status(200).json(health);
});

// Fallback to React app for unmatched routes (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gramaraksha';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(() => {
  logger.info('Connected to MongoDB');
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  logger.error('MongoDB connection error:', err.message);
  logger.error('Please check your MONGODB_URI environment variable');
  console.error('MongoDB connection error:', err.message);
  console.error('Please check your MONGODB_URI environment variable');

  // In development, start server anyway for testing
  if (process.env.NODE_ENV !== 'production') {
    logger.warn('Starting server in offline mode for development');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} (MongoDB offline)`);
    });
  } else {
    logger.error('Cannot start server without database connection in production');
    console.error('Cannot start server without database connection in production');
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  mongoose.connection.close(false, () => {
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
});
