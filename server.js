require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');

const { connectDB, disconnectDB, getResolvedMongoUri } = require('./config/database');

const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const { createSessionMiddleware } = require('./middleware/sessionMiddleware');

const apiRoutes = require('./routes/apiRoutes');

const app = express();
const server = http.createServer(app);


// ================= SOCKET.IO =================

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

allowedOrigins.push(
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5501',
  'http://127.0.0.1:5501',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
);

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

const connectedUsers = new Map();

io.on('connection', (socket) => {

  connectedUsers.set(socket.id, {
    id: socket.id,
    connectedAt: new Date(),
  });

  io.emit('userCount', connectedUsers.size);

  socket.on('sendMessage', (data) => {

    io.emit('chatMessage', {
      username: data.username || 'Anonymous',
      message: data.message,
      timestamp: new Date().toLocaleTimeString(),
      userId: socket.id,
    });

  });

  socket.on('userTyping', (data) => {

    socket.broadcast.emit('userTyping', {
      userId: socket.id,
      username: data.username,
    });

  });

  socket.on('disconnect', () => {

    connectedUsers.delete(socket.id);
    io.emit('userCount', connectedUsers.size);

  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

});


// ================= EXPRESS MIDDLEWARE =================

app.use(morgan('combined'));

app.use(
  cors({
    origin: (origin, callback) => {

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS origin not allowed: ${origin}`));

    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({
  extended: true,
  limit: '10mb',
}));

app.use(requestLogger);


// ================= SESSION =================

let sessionHandler = function sessionNoop(req, res, next) {
  next();
};

app.use((req, res, next) => sessionHandler(req, res, next));


// ================= VIEW ENGINE =================

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

const publicDir = path.join(__dirname,'public');
app.use(express.static(publicDir));


// ================= ROUTES =================

// MAIN API ROUTES
app.use('/api', apiRoutes);

// PRISMA USER ROUTES
//app.use('/api/users', require('./routes/userRoutes'));


// ================= PAGE ROUTES =================

app.get('/', (req, res) => {

  res.sendFile(
    path.join(publicDir, 'index.html')
  );

});

app.get('/auth/login', (req, res) => {

  res.render('auth', {
    title: 'Login - AUCTIONZ',
  });

});

app.get('/dashboard', (req, res) => {

  const mockUser = {
    _id: '1234567890',
    email: 'user@example.com',
    username: 'john_doe',
    fullName: 'John Doe',
    createdAt: new Date(),
  };

  res.render('dashboard', {
    title: 'Dashboard - AUCTIONZ',
    user: mockUser,
  });

});


// ================= 404 =================

app.use((req, res) => {

  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `${req.method} ${req.originalUrl} - This endpoint does not exist`,
  });

});


// ================= ERROR HANDLER =================

app.use(errorHandler);


// ================= SERVER =================

function normalizePort(value) {

  const port = parseInt(value, 10);

  if (Number.isNaN(port)) {
    return value;
  }

  if (port >= 0) {
    return port;
  }

  return false;

}

let portAttempt = normalizePort(process.env.PORT || '5000');

const NODE_ENV = process.env.NODE_ENV || 'development';


function startListening(port) {

  server.listen(port, () => {

    console.log(`\nServer: http://localhost:${port}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Socket.io: ws://localhost:${port}\n`);

  });

}


server.on('error', (error) => {

  if (error.syscall !== 'listen') {
    throw error;
  }

  if (error.code === 'EADDRINUSE') {

    const nextPort = Number(portAttempt) + 1;

    console.warn(
      `⚠️ Port ${portAttempt} is already in use. Retrying on ${nextPort}...`
    );

    portAttempt = nextPort;

    startListening(portAttempt);

    return;

  }

  console.error('Server error:', error);

  process.exit(1);

});


// ================= START SERVER =================

async function startServer() {

  try {

    console.log('\nInitializing application...\n');

    // MongoDB Connection
    await connectDB();

    // Session Middleware
    sessionHandler = createSessionMiddleware(
      getResolvedMongoUri()
    );

    // Start Express Server
    startListening(portAttempt);

  } catch (error) {

    console.error('Failed to start server:', error.message);

    process.exit(1);

  }

}


// ================= SHUTDOWN =================

process.on('SIGTERM', async () => {

  server.close(async () => {

    await disconnectDB();

    process.exit(0);

  });

});

process.on('SIGINT', async () => {

  server.close(async () => {

    await disconnectDB();

    process.exit(0);

  });

});

process.on('uncaughtException', (error) => {

  console.error('Uncaught Exception:', error);

  process.exit(1);

});

process.on('unhandledRejection', (reason, promise) => {

  console.error('Unhandled Rejection:', promise, reason);

  process.exit(1);

});


// ================= START =================

// ================= START =================

// Server sirf tab start hoga jab test mode me na ho
if (process.env.NODE_ENV !== 'test') {

  startServer();

}

// Testing ke liye export
module.exports = { app, server, io };