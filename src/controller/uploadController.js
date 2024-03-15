const s3Service = require('../infrastructure/aws/s3Service');
const logger = require('../config/loggerConfig')(module);

module.exports = {
    checkUploadStatusHeader: async (req, res, dbConnection) => {
        try {
            await s3Service.checkUploadStatusHeader(req, res, dbConnection);
            logger.info('upload request header status controller To service');
            res.status(200).send('Upload status checked successfully')
        } catch (error) {
            logger.error('Error procession upload status', error);
            res.status(500).send('Error processing upload');
        }
    }

    uploadJson: async (req, res, dbConnection) => {
        try {
            
        }
    }
}



