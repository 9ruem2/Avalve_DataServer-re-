'use strict';

require("dotenv").config();

const configs = {
    aws: {
        s3Bucket: process.env.S3_BUCKET_LOCATION,
        s3BucketPfc: process.env.S3_BUCKET_LOCATION_PFC,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: 'ap-northeast-2' // AWS 리전 설정, 필요한 경우 .env 파일에서 설정하도록 변경
    },
    ssl: {
        keyLocation: process.env.KEY_LOC,
        certLocation: process.env.CERT_LOC
    },
    database: {
        host: process.env.DB_HOST, // TODO: env파일에서 host -> DB_HOST로 변경 
        user: process.env.DB_USER,
        name: process.env.DB_NAME,
        password: process.env.DB_PASSWORD
    },
    manufacturer: process.env.MFR_KEY,
    server: {
        socketIoPort: process.env.SIO_PORT,
        httpPort: process.env.HTTP_PORT
    }
};

module.exports = configs;
