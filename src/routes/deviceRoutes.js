const express = require('express');
const router = express.Router();
const deviceController = require('../controller/deviceController');

router.get('/devices', deviceController.listDevices);
router.post('/devices', deviceController.registerDevice);
// 추가 라우트 정의

module.exports = router;
