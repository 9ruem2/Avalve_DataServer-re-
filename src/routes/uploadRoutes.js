const express = require('express');
const uploadController = require('../controller/uploadController');
const uploadConfig = require('../config/uploadConfig');

module.exports = function setupUploadRouter(dbConnection) {
    const router = express.Router();
    
    router.head('/status',(req, res) => uploadController.checkUploadStatusHeader(req, res, dbConnection));
    router.post('/image', uploadConfig.single('imageFile'), (req, res) => uploadController.uploadImage(req, res, dbConnection));
    router.post('/json', uploadConfig.single('jsonFile'), (req, res) => uploadController.uploadJson(req, res, dbConnection));

    return router;
}




/*
"SIO": "http://3.38.140.149:3000",
"HEAD": "http://3.38.140.149:3000/upload_status",
"JSON": "http://3.38.140.149:3000/upload/json/2.1",
"IMG": "http://3.38.140.149:3000/upload/image/2.1"
*/