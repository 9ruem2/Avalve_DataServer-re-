const AWS = require('aws-sdk');
const configs = require('../../config/configs');

const s3 = new AWS.S3({
    accessKeyId: configs.aws.accessKeyId,
    secretAccessKey: configs.aws.secretAccessKey,
    region: configs.aws.region
});

exports.uploadFile = async (file, path) => {
    const params = {
        Bucket: configs.aws.s3Bucket,
        Key: `${path}${file.originalname}`,
        Body: file.buffer,
        ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
};
