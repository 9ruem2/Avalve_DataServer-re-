const axios = require('axios');
const logger = require('../../config/loggerConfig')(module);
const deviceRepository = require('../../repository/deviceRepository');
const config = require('../../config/configs');
const uploadConfig = require('../../config/uploadConfig');

const uploadSingleImage = uploadConfig.single('file');
const uploadSingleJson = uploadConfig.single('file');

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
    await deviceRepository.updateHttpAccessStatusToEnabled(req.headers.token, dbConnection);
  }
}

// 'upload_finish' 
class UploadFinish extends UploadInterface { 
  constructor(FileListManager) {
    super();
    this.FileListManager = FileListManager;
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
        lambdaUrl = config.lambdaUrls.SENSORBOX;
        jsonUploadList = this.fileListManager.sensorboxJsonFiles;
        break;
      case 'yongin_camera':
        lambdaUrl = config.lambdaUrls.YONGIN_CAMERA;
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

const fileListManager = new FileListManager();
const makeUploadObject = {
  'upload_start': new UploadStart(),
  'upload_finish': new UploadFinish(fileListManager)
};

module.exports = {
  // 클라이언트의 header.status를 확인하여 youngin_camera, sensorbox를 lambda로 실행
  checkUploadStatusHeader: async (req, res, dbConnection) => {
    const uploadObjectCreated = makeUploadObject[req.headers.status];

    if (uploadObjectCreated) {
      await uploadObjectCreated.execute(req, dbConnection);
    } else {
      logger.error('Undefined upload status');
    }
  },

  uploadImage: async(req, res, dbConnection) => {
    uploadConfig(req, res, dbConnection);
  }

};
