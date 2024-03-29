const axios = require('axios');
const util = require('util');
const logger = require('../../config/loggerConfig')(module);
const deviceRepository = require('../../repository/deviceRepository');
const config = require('../../config/configs');

// 인터페이스 정의
class UploadInterface {
  async execute(req, dbConnection) {
    throw new Error('Execute method should be implemented');
  }
}

// 'upload_start'
class UploadStart extends UploadInterface {
  async execute(req, dbConnection) {
    logger.info("(HEAD) upload start");
    await deviceRepository.updateStatusHttpAccess(req.headers.token, dbConnection);
  }
}

// 'upload_finish' 
class UploadFinish extends UploadInterface { 
  constructor(fileListManager) {
    super();
    this.fileListManager = fileListManager;
  }

  async execute(req, dbConnection) {
    logger.info("(HEAD) upload finish");
    await deviceRepository.clearHttpAccessByToken(req.headers.token, dbConnection);

    // lambdaUrl, jsonUploadList 변수 초기화
    const deviceName = req.headers.device_name;
    let lambdaUrl = '';
    let jsonUploadList = [];

    switch (deviceName) {
      case 'Sensorbox':
        lambdaUrl = config.lambdaUrls.sensorbox;
        jsonUploadList = this.fileListManager.sensorboxJsonFiles;
        break;
      case 'yongin_camera':
        lambdaUrl = config.lambdaUrls.yonginCamera;
        jsonUploadList = this.fileListManager.yonginCameraJsonFiles;
        break;
      default:
        logger.info('Unknown device type');
        return;
    }

    // Lambda 람다 요청 처리
    await processLambdaRequest(jsonUploadList, lambdaUrl);

    // 파일 리스트 초기화
    this.fileListManager.clearFiles();
  }
}

// Lambda Request 처리 함수
async function processLambdaRequest(jsonUploadList, lambdaUrl) {
  for (let item of jsonUploadList) {
    logger.info("%s Lambda URL Request", item);
    try {
      const response = await axios.post(lambdaUrl, {}, {
        headers: { 'json_filename': item }
      });
      logger.info(response.data);
    } catch (error) {
      logger.error(error.response ? error.response.data : error.message);
    }
  }
}

// 파일 리스트를 관리하는 클래스
class FileListManager {
  constructor() {
    this.yonginCameraJsonFiles = []; // yongin_camera 디바이스에서 업로드된 JSON 파일 목록
    this.sensorboxJsonFiles = []; // Sensorbox 디바이스에서 업로드된 JSON 파일 목록
    this.allUploadedJsonFiles = []; // 모든 디바이스에서 업로드된 JSON 파일 목록
  }

  addFile(deviceName, fileName) {
    if (deviceName == "Sensorbox") {
      this.sensorboxJsonFiles.push(fileName);
    } else if (deviceName == "yongin_camera") {
      this.yonginCameraJsonFiles.push(fileName);
    }
    this.allUploadedJsonFiles.push(fileName);
  }

  clearFiles() {
    this.sensorboxJsonFiles = [];
    this.allUploadedJsonFiles = [];
    this.yonginCameraJsonFiles = [];
  }
}

const fileListManager = new FileListManager();

const makeUploadObject = {
  'upload_start': new UploadStart(),
  'upload_finish': new UploadFinish(fileListManager)
};

module.exports = {
  checkUploadStatusHeader: async (req, res, dbConnection) => {
    const uploadObjectCreated = makeUploadObject[req.headers.status];

    if (uploadObjectCreated) {
      await uploadObjectCreated.execute(req, dbConnection);
    } else {
      logger.error('Undefined upload status');
    }
  },

  uploadImage: (req, res, dbConnection) => {
    try {
      logger.info(`${req.headers.device_owner}-${req.headers.device_name} image: ${req.file.originalname}`);
    } catch(err) {
      logger.error(`${req.headers.device_owner}-${req.headers.device_name} upload(img) error`);
      throw err;
    }
  },

  uploadJson: (req, res, dbConnection) => {
    try {
      logger.info(`${req.headers.device_owner}-${req.headers.device_name} json ${req.file.originalname}`);
      fileListManager.addFile(req.headers.device_name, req.file.originalname);
    } catch(err) {
      logger.error(`${req.headers.device_owner}-${req.headers.device_name} upload(json) error: ${err.message}`);
    }
  }
};
