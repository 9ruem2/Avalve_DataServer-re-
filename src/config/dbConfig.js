const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const configs = require('./configs');
const logger = require('./loggerConfig')(module); 

// AWS S3 설정 초기화
AWS.config.update({
    accessKeyId: configs.aws.AWS_ACCESS_KEY, 
    secretAccessKey: configs.aws.AWS_SECRET_ACCESS_KEY, 
    region: configs.aws.AWS_REGION
});

const s3 = new AWS.S3(); 

// multerS3 스토리지 엔진을 사용한 multer 설정
const multerS3Storage = multerS3({
    s3: s3, 
    bucket: configs.aws.S3_BUCKET_LOCATION, 
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    acl: 'public-read', 

    // 업로드된 파일의 메타데이터 설정 함수
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },

    // 파일이 S3에 저장될 때의 파일명과 경로 설정 함수
    key: (req, file, cb) => {
        let prefix = 'Smartfarm'; // 파일 저장 경로의 접두어
        let deviceOwner = req.headers.device_owner; // 디바이스 소유자 정보
        let deviceName = req.headers.device_name; // 디바이스 이름
        let fileType = ''; // 파일 타입
        let filePath = ''; // 최종 파일 경로

        // 파일 경로와 이름을 결정하는 로직
        cb(null, filePath);
    }
});

module.exports = multer({ storage: multerS3Storage });
