'use strict';

require("dotenv").config();

const configs = {
    aws: {
        s3Bucket: process.env.S3_BUCKET_LOCATION,
        s3BucketPfc: process.env.S3_BUCKET_LOCATION_PFC,
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.REGION
    },
    ssl: {
        keyLocation: process.env.KEY_LOC,
        certLocation: process.env.CERT_LOC
    },
    database: {
        host: process.env.DB_HOST, 
        user: process.env.DB_USER,
        name: process.env.DB_NAME,
        password: process.env.DB_PASSWORD
    },
    smartFarmManufacturer: process.env.SMART_FARM_MANUFACTURER,
    
    server: {
        socketIoPort: process.env.SIO_PORT, //TODO: 없애야 할지도
        httpPort: process.env.HTTP_PORT
    },
    lambdaUrls: { 
        sensorbox: process.env.SENSORBOX,
        yonginCamera: process.env.YONGIN_CAMERA
    }
};

module.exports = configs;
