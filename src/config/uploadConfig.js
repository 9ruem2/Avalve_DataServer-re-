const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const configs = require('./configs');

// AWS S3 설정 초기화
AWS.config.update({
    accessKeyId: configs.aws.AWS_ACCESS_KEY,
    secretAccessKey: configs.aws.AWS_SECRET_ACCESS_KEY,
    region: configs.aws.AWS_REGION
});

const s3 = new AWS.S3();

// 파일 업로드를 위한 multerS3 스토리지 엔진 설정
const multerS3Storage = multerS3({
    s3: s3,
    bucket: configs.aws.S3_BUCKET_LOCATION,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        let prefix = 'Smartfarm';
        let deviceOwner = req.headers.device_owner;
        let deviceName = req.headers.device_name;
        let fileType = '';
        let filePath = '';
        
        // 파일 타입에 따른 처리 로직
        switch (file.mimetype) {
            case "image/jpeg":
                let imgFilenameParts = file.originalname.split("_");
                let imgDateParts = imgFilenameParts[2].split("-");
                let yyyy = imgDateParts[0];
                let mmdd = imgDateParts[1] + imgDateParts[2];
                fileType = "image";
                filePath = `${prefix}/${deviceOwner}/${deviceName}/${yyyy}/${mmdd}/${fileType}/${file.originalname}`;
                break;

            case "application/json":
                let jsonFilenameParts = file.originalname.split("_");
                let jsonDateParts = jsonFilenameParts[0].split("-");
                yyyy = jsonDateParts[0];
                mmdd = jsonDateParts[1] + jsonDateParts[2];
                fileType = "json";
                filePath = `${prefix}/${deviceOwner}/${deviceName}/${yyyy}/${mmdd}/${fileType}/${file.originalname}`;
                break;

            default:
                fileType = "undefined";
                filePath = `${prefix}/${deviceOwner}/${deviceName}/undefined/${fileType}/${file.originalname}`;
                break;
        }

        cb(null, filePath);
    }
});

module.exports = multer({ storage: storage });