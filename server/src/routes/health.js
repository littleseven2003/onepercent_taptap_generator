const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ code: 200, message: 'ok' });
});

module.exports = router;
