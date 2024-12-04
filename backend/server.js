require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const geoip = require('geoip-lite');

// Logging setup
const log = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] ${message}`);
};

// Express and Socket.io setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.CORS_ORIGIN || "*"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.CORS_ORIGIN || "*"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection with Enhanced Error Handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/emotional-archive';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    log(`Connected to MongoDB at ${mongoURI}`, 'info');
  } catch (error) {
    log(`MongoDB connection error: ${error.message}`, 'error');
    // Exit process with failure
    process.exit(1);
  }
};

// Connect to Database
connectDB();

// Confession Schema
const ConfessionSchema = new mongoose.Schema({
  text: String,
  location: {
    latitude: Number,
    longitude: Number,
    city: String,
    country: String
  },
  timestamp: { type: Date, default: Date.now }
});

const Confession = mongoose.model('Confession', ConfessionSchema);

// IP Geolocation Middleware with Enhanced Fallback
const getLocationFromIP = (req, res, next) => {
  try {
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    log(`Attempting to geolocate IP: ${clientIP}`, 'info');

    // Remove IPv6 to IPv4 prefix if present
    const cleanIP = clientIP.replace(/^::ffff:/, '');

    const geo = geoip.lookup(cleanIP);
    
    if (geo) {
      req.userLocation = {
        latitude: geo.ll[0],
        longitude: geo.ll[1],
        city: geo.city || 'Unknown',
        country: geo.country || 'Unknown'
      };
    } else {
      // Fallback to random location
      req.userLocation = {
        latitude: Math.random() * 180 - 90,
        longitude: Math.random() * 360 - 180,
        city: 'Unknown',
        country: 'Unknown'
      };
    }
    
    next();
  } catch (error) {
    log(`Geolocation error: ${error.message}. Using random location.`, 'warn');
    req.userLocation = {
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
      city: 'Unknown',
      country: 'Unknown'
    };
    next();
  }
};

// Rate Limiting Middleware
const rateLimiter = async (req, res, next) => {
  const MAX_CONFESSIONS_PER_HOUR = process.env.MAX_CONFESSIONS_PER_HOUR || 50;
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    const recentConfessionsCount = await Confession.countDocuments({
      timestamp: { $gte: oneHourAgo }
    });

    if (recentConfessionsCount >= MAX_CONFESSIONS_PER_HOUR) {
      log('Rate limit exceeded', 'warn');
      return res.status(429).json({ error: 'Too many confessions. Please try again later.' });
    }

    next();
  } catch (error) {
    log(`Rate limit check failed: ${error.message}`, 'error');
    res.status(500).json({ error: 'Rate limit check failed' });
  }
};

// Routes
app.post('/api/confessions', getLocationFromIP, rateLimiter, async (req, res) => {
  try {
    const { text } = req.body;
    const location = req.userLocation;

    const confession = new Confession({
      text,
      location,
      timestamp: new Date()
    });

    await confession.save();
    log(`New confession saved from ${location.city}, ${location.country}`, 'info');

    // Emit to all connected clients
    io.emit('newConfession', {
      text: confession.text,
      location: confession.location
    });

    res.status(201).json(confession);
  } catch (error) {
    log(`Confession save error: ${error.message}`, 'error');
    res.status(500).json({ error: 'Failed to save confession' });
  }
});

app.get('/api/confessions', async (req, res) => {
  try {
    // Get recent confessions (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const confessions = await Confession.find({
      timestamp: { $gte: twentyFourHoursAgo }
    }).sort({ timestamp: -1 });

    res.json(confessions);
  } catch (error) {
    log(`Confession retrieval error: ${error.message}`, 'error');
    res.status(500).json({ error: 'Failed to retrieve confessions' });
  }
});

// IP Location Endpoint
app.get('/api/locate', getLocationFromIP, (req, res) => {
  log(`Location request from IP: ${req.socket.remoteAddress}`, 'info');
  res.json({
    latitude: req.userLocation.latitude,
    longitude: req.userLocation.longitude,
    city: req.userLocation.city,
    country: req.userLocation.country
  });
});

// Socket.io Connection
io.on('connection', (socket) => {
  log('New client connected', 'info');

  // Send initial confessions on connection
  Confession.find({
    timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  }).sort({ timestamp: -1 }).then((confessions) => {
    socket.emit('initialConfessions', confessions);
  });

  socket.on('submitConfession', async (data) => {
    try {
      const confession = new Confession({
        text: data.text,
        location: data.location,
        timestamp: new Date()
      });

      await confession.save();
      log(`Confession submitted via socket from ${data.location.city}`, 'info');
      io.emit('newConfession', confession);
    } catch (error) {
      log(`Socket confession submission error: ${error.message}`, 'error');
    }
  });

  socket.on('disconnect', () => {
    log('Client disconnected', 'info');
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  log(`Server running on ${HOST}:${PORT}`, 'info');
});
