const s3Service = require('../infrastructure/aws/s3Service');

exports.uploadImage = async (file) => {
    return s3Service.uploadFile(file, 'images/');
};

exports.uploadJson = async (file) => {
    return s3Service.uploadFile(file, 'json/');
};
