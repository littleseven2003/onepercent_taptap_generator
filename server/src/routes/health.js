const express = require('express');
const { getRateLimitConfig } = require('../services/rateLimiter');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ code: 200, message: 'ok' });
});

router.get('/config', (req, res) => {
  res.json({
    code: 200,
    data: {
      rateLimit: getRateLimitConfig(),
    },
  });
});

module.exports = router;
