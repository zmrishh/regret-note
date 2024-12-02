require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { testMongoDBConnection, networkHealthCheck } = require('./utils/network-diagnostics');

const authRoutes = require('./routes/auth.routes');
const confessionRoutes = require('./routes/confession.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Perform initial network health check
networkHealthCheck();

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Regret Journal API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      auth: '/api/auth',
      confessions: '/api/confessions',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/confessions', confessionRoutes);
app.use('/api/users', userRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Backend is running smoothly',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
    availableEndpoints: {
      auth: '/api/auth',
      confessions: '/api/confessions',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { error: err.stack })
  });
});

// MongoDB Connection Options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Database connection with improved error handling and network diagnostics
const connectWithRetry = async () => {
  try {
    console.log('🔄 Attempting MongoDB Connection...');
    
    // Run network diagnostics before connecting
    await testMongoDBConnection(process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
    console.log('✅ Connected to MongoDB successfully');
    
    // Start server with port retry logic
    const startServer = (retryCount = 0) => {
      const server = app.listen(PORT + retryCount)
        .on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${PORT + retryCount} is busy, trying ${PORT + retryCount + 1}...`);
            server.close();
            startServer(retryCount + 1);
          } else {
            console.error('❌ Server Error:', err);
          }
        })
        .on('listening', () => {
          const actualPort = server.address().port;
          console.log(`🚀 Server running on port ${actualPort}`);
          console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
          console.log(`📚 API Documentation: http://localhost:${actualPort}`);
        });

      // Graceful shutdown handler
      process.on('SIGTERM', () => {
        console.log('👋 SIGTERM received. Performing graceful shutdown...');
        server.close(() => {
          console.log('✅ Server closed');
          process.exit(0);
        });
      });
    };

    startServer();
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err);
    console.log('🔁 Retrying connection in 5 seconds...');
    
    // Log detailed error information
    console.log('Detailed Error Analysis:');
    console.log(`Error Code: ${err.code}`);
    console.log(`Error Message: ${err.message}`);
    
    setTimeout(connectWithRetry, 5000);
  }
};

// Initial connection attempt
connectWithRetry();

// Mongoose connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
});

module.exports = app;
