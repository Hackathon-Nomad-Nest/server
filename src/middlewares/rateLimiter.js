const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  // skipSuccessfulRequests: false,
  message: 'Too many requests. Try again later.',
});

module.exports = {
  authLimiter,
};
