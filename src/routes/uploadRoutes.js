const express = require('express');
const router = express.Router();
const uploadController = require('../controller/uploadController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

router.post('/upload/image', uploadMiddleware.single('image'), uploadController.uploadImage);
router.post('/upload/json', uploadMiddleware.single('json'), uploadController.uploadJson);

module.exports = router;
