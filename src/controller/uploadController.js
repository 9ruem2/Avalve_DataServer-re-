const s3Service = require('../infrastructure/aws/s3Service');
const logger = require('../config/loggerConfig')(module);
const config = require('../config/configs')

module.exports = {
    checkUploadStatusHeader: async (req, res, dbConnection) => {
        try {
            await s3Service.checkUploadStatusHeader(req, res, dbConnection);
            logger.info('upload request header status successfully.');
            res.status(200).send('Upload status checked successfully');
        } catch(error) {
            logger.error('Error procession upload status', error);
            res.status(500).send('Error processing upload');
        }
    },

    uploadImage: async (req, res, dbConnection) => {
        try {
            const result = await s3Service.uploadImage(req, res, dbConnection);
            logger.info(`Image file uploaded successfully. Filename: ${req.file.originalname}, Size: ${req.file.size} bytes, Bucket: ${config.aws.s3Bucket}, Timestamp: ${new Date().toISOString()}`);
            res.status(200).send({message: 'Image upload successfully', data: result });
        } catch(error) {
            logger.error(error);
            res.status(500).send({ message: 'Image upload failed.'});
        }
    },

    uploadJson: async (req, res, dbConnection) => {
        try {
            const result = await s3Service.uploadJson(req, res, dbConnection);
            logger.info(`JSON file uploaded successfully. Filename: ${req.file.originalname}, Size: ${req.file.size} bytes, Bucket: ${config.aws.s3Bucket}, Timestamp: ${new Date().toISOString()}`);
            res.status(200).send({message: 'Json listUp successfully', data: result });
        } catch(error) {
            logger.error(error);
            res.status(500).send({ message: 'Failed to upload JSON' });
        }
    }
}



