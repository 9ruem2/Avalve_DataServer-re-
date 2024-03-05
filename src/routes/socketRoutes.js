const express = require('express');
const router = express.Router();

router.use('/upload', checkTokenMiddleware);

module.exports = router;
