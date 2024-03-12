const uploadConfig = require('../../config/uploadConfig');
const logger = require('../../config/loggerConfig')(module);
const deviceRepository = require('../../repository/deviceRepository');

module.exports = {
    checkUploadStatusHeader: (req, dbConnection) => {
        const UPLOAD_START = "upload_start";
        const UPLOAD_FINISH = "upload_finish";
        const SENSORBOX = "Sensorbox";
        const YONGIN_CAMERA = "yongin_camera";

        function processLambdaRequest(jsonList, deviceName, lambdaUrl) {
            for (const item of jsonList) {
              logger.info("%s Lambda URL Request", item);
              request.post({
                headers: { "json_filename": item },
                url: lambdaUrl
              }, function(error, response, body) {
                logger.info(body);
              });
            }
            return [];
        }

        if(req.headers.status == UPLOAD_START) {
            logger.info("(HEAD)upload start");
            deviceRepository.updateHttpAccessStatusToEnabled(req.headers.token, dbConnection); //TODO: 만들어야함
        } else if (req.headers.status == UPLOAD_FINISH) {
            logger.info("(HEAD)upload finish");
            deviceRepository.clearHttpAccessByToken(req.headers.token, dbConnection);// TODO: 만들어야 함

            if(req.headers.device_name == SENSORBOX) {
                json_list = processLambdaRequest() //TODO: 여기부터 해야함
            }
        }

    }
}