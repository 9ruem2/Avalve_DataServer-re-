const express = require('express');
const checkTokenMiddleware = require('./middleware/checkTokenMiddleware');
const router = express.Router();

router.use('/upload', checkTokenMiddleware);

module.exports = router;
