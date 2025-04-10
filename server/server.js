/**
 * Radiation Admin Backend Server
 * Features:
 * - Express REST API
 * - Socket.IO with rate limiting
 * - MongoDB with connection pooling
 * - Automated backup (to be added)
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { getBackupStatus } = require('./backup');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Middleware
app.use(cors());
app.use(express.json());
// Protect admin dashboard UI routes
app.use('/admin', (req, res, next) => {
  const apiKey = req.headers.authorization;
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    // Optionally redirect to login page or home
    return res.status(401).send('Unauthorized');
  }
  next();
});

// Admin API key auth middleware
const adminAuthMiddleware = (req, res, next) => {
  const apiKey = req.headers.authorization;
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Basic REST API rate limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);

// MongoDB connection pooling
const mongoUri = process.env.MONGODB_URI;
const dbName = 'radiation_admin';
let db, zonesCollection, versionsCollection, presetsCollection, analyticsCollection;

async function connectMongo() {
  const client = new MongoClient(mongoUri, {
    maxPoolSize: 20, // Connection pool size
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  db = client.db(dbName);
  zonesCollection = db.collection('zones');
  versionsCollection = db.collection('versions');
  presetsCollection = db.collection('presets');
  analyticsCollection = db.collection('analytics');
  console.log('Connected to MongoDB with pooling');
}

// Socket.IO rate limiting middleware (simple token bucket)
const socketRateLimit = {};
const SOCKET_LIMIT = 20; // max events per window
const SOCKET_WINDOW = 10000; // 10 seconds

io.use((socket, next) => {
  const ip = socket.handshake.address;
  if (!socketRateLimit[ip]) {
    socketRateLimit[ip] = [];
  }
  const now = Date.now();
  socketRateLimit[ip] = socketRateLimit[ip].filter(ts => now - ts < SOCKET_WINDOW);
  if (socketRateLimit[ip].length >= SOCKET_LIMIT) {
    return next(new Error('Rate limit exceeded'));
  }
  socketRateLimit[ip].push(now);
  next();
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('updateZones', async () => {
    socket.broadcast.emit('zonesUpdated');
  });

  socket.on('updateVersions', async () => {
    socket.broadcast.emit('versionsUpdated');
  });

  socket.on('updatePresets', async () => {
    socket.broadcast.emit('presetsUpdated');
  });
});

// Health Check Endpoint
app.get('/healthz', async (req, res) => {
 let mongoConnected = false;
 try {
   // Check if collections are initialized
   mongoConnected = !!(zonesCollection && versionsCollection && presetsCollection && analyticsCollection);
 } catch (e) {
   mongoConnected = false;
 }

 res.json({
   status: 'ok',
   uptime: process.uptime(),
   mongoConnected,
   backup: getBackupStatus()
 });
});
// Serve protected admin dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/admin/index.html'));
});

// Support client-side routing under /admin/*
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/admin/index.html'));
});

// API Endpoints

// Zones
app.get('/api/radiation-zones', async (req, res) => {
  const zones = await zonesCollection.find().toArray();
  res.json(zones);
});

app.post('/api/radiation-zones', adminAuthMiddleware, async (req, res) => {
  const zones = req.body;
  await zonesCollection.deleteMany({});
  await zonesCollection.insertMany(zones);
  io.emit('zonesUpdated');
  res.sendStatus(200);
});

// Versions
app.get('/api/radiation-versions', async (req, res) => {
  const versions = await versionsCollection.find().sort({ timestamp: -1 }).toArray();
  res.json(versions);
});

app.post('/api/radiation-versions', adminAuthMiddleware, async (req, res) => {
  const version = req.body;
  await versionsCollection.insertOne(version);
  io.emit('versionsUpdated');
  res.sendStatus(200);
});

// Presets
app.get('/api/radiation-presets', async (req, res) => {
  const presets = await presetsCollection.find().toArray();
  res.json(presets);
});

app.post('/api/radiation-presets', adminAuthMiddleware, async (req, res) => {
  const preset = req.body;
  await presetsCollection.insertOne(preset);
  io.emit('presetsUpdated');
  res.sendStatus(200);
});

app.put('/api/radiation-presets', adminAuthMiddleware, async (req, res) => {
  const presets = req.body;
  await presetsCollection.deleteMany({});
  await presetsCollection.insertMany(presets);
  io.emit('presetsUpdated');
  res.sendStatus(200);
});

// Analytics
app.post('/api/analytics', adminAuthMiddleware, async (req, res) => {

// Initialize automated backup system
require('./backup');
  const event = req.body;
  await analyticsCollection.insertOne(event);
  res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 3000;
connectMongo().then(() => {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});