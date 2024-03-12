const s3Service = require('../infrastructure/aws/s3Service');


module.exports = {
    checkUploadStatusHeader: (req, res, dbConnection) => {
        s3Service.checkUploadStatusHeader(req,dbConnection);
        res.status(200).json({'message': 'Starting to check the header value'});
    }

}



