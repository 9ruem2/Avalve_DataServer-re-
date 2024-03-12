const deviceRepository = require("../repository/deviceRepository");
const logger = require('../config/loggerConfig')(module);


// token이 일치하는지 확인하는 로직
module.exports = function setupUploadMiddleware(dbConnection) {
    return async (req, res, next) => {
        try {
            const result = await deviceRepository.findDeviceByOwnerAndName(req.headers.device_owner, req.headers.device_name, dbConnection);
            if (result.length > 0 && result[0].http_token == req.headers.token) {
                logger.info(`Token validation successful for device owner: ${req.headers.device_owner} and device name: ${req.headers.device_name}`);
                next();
            } else {
                logger.error(`Token validation failed for device owner: ${req.headers.device_owner} and device name: ${req.headers.device_name}`);
                res.status(401).send('HTTP auth (token) error');
            }
        } catch (error) {
            logger.error('Error in token validation middleware:', error);
            res.status(500).send('Internal Server Error');
        }
    };
};
   