const multer = require('multer');
const storage = multer.memoryStorage(); // 또는 S3, diskStorage 등을 사용

const upload = multer({ storage: storage });
module.exports = upload;
