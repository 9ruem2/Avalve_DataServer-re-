'use strict';

require("dotenv").config();

const configs = {
    aws: {
        s3Bucket: process.env.S3_BUCKET_LOCATION,
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
        port: process.env.PORT
    },
    lambdaUrls: { 
        sensorbox: process.env.SENSORBOX,
        yonginCamera: process.env.YONGIN_CAMERA
    }
};

module.exports = configs;
