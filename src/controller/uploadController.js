const s3Service = require('../infrastructure/aws/s3Service');
const logger = require('../config/loggerConfig')(module);

module.exports = {
    checkUploadStatusHeader: async (req, res, dbConnection) => {
        try {
            await s3Service.checkUploadStatusHeader(req, res, dbConnection);
            logger.info('upload request header status controller To service');
            res.status(200).send('Upload status checked successfully');
        } catch(error) {
            logger.error('Error procession upload status', error);
            res.status(500).send('Error processing upload');
        }
    },

    uploadJson: async (req, res, dbConnection) => {
        try {
            await s3Service.uploadJson(req, res, dbConnection);
            // logger.info(`JSON file uploaded successfully. Filename: ${req.file.originalname}, Size: ${req.file.size} bytes, Bucket: ${config.aws.s3Bucket}, Timestamp: ${new Date().toISOString()}`);
            res.status(200).send('Json upload successfully');
        } catch(error) {
            logger.error(error);
            res.status(500).send('Json upload failed')
        }
    },

    uploadImage: async (req, res, dbConnection) => {
        try {
            await s3Service.uploadImage(req, res, dbConnection);
            logger.info(`Image file uploaded successfully. Filename: ${req.file.originalname}, Size: ${req.file.size} bytes, Bucket: ${config.aws.s3Bucket}, Timestamp: ${new Date().toISOString()}`);
            res.status(200).send('Image upload successfully');
        } catch(error) {
            logger.error(error);
            res.status(500).send('Image upload failed.');
        }
    }
}



