const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const cookieParser = require('cookie-parser');
const http = require('http');
const config = require('./config/config');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const ApiError = require('./utils/ApiError');
const { configure } = require('./socket');

const app = express();

// Set security HTTP headers
app.use(helmet());
// app.use(cors({ origin: '*' })); 
const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true,  
};

app.use(cors(corsOptions));

// Expose headers
app.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'Content-Disposition');
  next();
});

// Parse JSON request body
app.use(express.json({ limit: '50mb' }));

// Parse URL-encoded request body
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Sanitize request data
app.use(xss());
app.use(mongoSanitize());

// Gzip compression
app.use(compression());

// Initialize Passport and use JWT strategy
app.use(cookieParser());

// Apply rate limiter for authentication routes only
if (!config.socket) {
  app.use(authLimiter);
}

// Set up API routes
app.use('/v1', routes);

// Running status route
app.get('/runningStatus', (req, res) => {
  res.send({ status: httpStatus.OK, message: 'Server running' });
});

// Handle 404 errors for unknown routes
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode,
    message: err.message || 'Internal Server Error',
  });
});

// Create server and configure WebSocket if applicable
let server = app;
if (config.socket) {
  server = http.createServer(app);
  configure(server, app);
}

module.exports = server;
