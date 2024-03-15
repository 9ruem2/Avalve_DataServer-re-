const express = require('express');
const uploadController = require('../controller/uploadController');

module.exports = function setupUploadRouter(dbConnection) {
    const router = express.Router();
    
    router.head('/upload_status', (req,res) => 
        uploadController.checkUploadStatusHeader(req, res, dbConnection));

    router.post('/json/2.1', (req, res) => 
        uploadController.uploadJson(req, res, dbConnection));

        

    
    return router;
}




/*
"SIO": "http://3.38.140.149:3000",
"HEAD": "http://3.38.140.149:3000/upload_status",
"JSON": "http://3.38.140.149:3000/upload/json/2.1",
"IMG": "http://3.38.140.149:3000/upload/image/2.1"
*/