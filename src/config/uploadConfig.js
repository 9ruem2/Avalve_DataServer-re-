const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

module.exports = (configs) => {
    // AWS S3 설정 초기화
    AWS.config.update({
        accessKeyId: configs.aws.AWS_ACCESS_KEY,
        secretAccessKey: configs.aws.AWS_SECRET_ACCESS_KEY,
        region: configs.aws.AWS_REGION
    });

    const s3 = new AWS.S3();

    // 파일 업로드를 위한 multerS3 스토리지 엔진 설정
    const multerS3Storage = multerS3({
        s3,
        bucket: configs.aws.S3_BUCKET_LOCATION,
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
            if (file.mimetype === "image/jpeg") {
                const [_, __, imgDate] = file.originalname.split("_");
                const [yyyy, mm, dd] = imgDate.split("-");
                fileType = "image";
                filePath = `${prefix}/${deviceOwner}/${deviceName}/${yyyy}/${mm + dd}/${fileType}/${file.originalname}`;
            } else if (file.mimetype === "application/json") {
                const [jsonDate, ___] = file.originalname.split("_");
                const [yyyy, mm, dd] = jsonDate.split("-");
                fileType = "json";
                filePath = `${prefix}/${deviceOwner}/${deviceName}/${yyyy}/${mm + dd}/${fileType}/${file.originalname}`;
            } else {
                fileType = "undefined";
                filePath = `${prefix}/${deviceOwner}/${deviceName}/undefined/${fileType}/${file.originalname}`;
            }

            cb(null, filePath);
        }
    });

    return multer({ storage: multerS3Storage });
};
