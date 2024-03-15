const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const config = require('./config'); 

module.exports = () => { 
    // AWS S3 설정 초기화
    AWS.config.update({
        accessKeyId: config.aws.AWS_ACCESS_KEY, 
        secretAccessKey: config.aws.AWS_SECRET_ACCESS_KEY,
        region: config.aws.AWS_REGION
    });

    const s3 = new AWS.S3();

    // 파일 업로드를 위한 multerS3 스토리지 엔진 설정
    const multerS3Storage = multerS3({
        s3,
        bucket: config.aws.S3_BUCKET_LOCATION,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const prefix = 'Smartfarm';
            const { device_owner: deviceOwner, device_name: deviceName } = req.headers;
            let fileType;
            let filePath;

            // 파일 타입에 따른 처리 로직
            if (file.mimetype.startsWith("image/")) {
                fileType = "image";
            } else if (file.mimetype === "application/json") {
                fileType = "json";
            } else {
                fileType = "undefined";
            }

            // 현재 날짜를 사용하여 파일 경로 생성
            const date = new Date();
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
            const dd = String(date.getDate()).padStart(2, '0');
            filePath = `${prefix}/${deviceOwner}/${deviceName}/${yyyy}/${mm}-${dd}/${fileType}/${file.originalname}`;

            cb(null, filePath);
        }
    });

    return multer({ storage: multerS3Storage });
};
