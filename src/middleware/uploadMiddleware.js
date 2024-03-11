const deviceRepository = require("../repository/deviceRepository");
const logger = require('./src/config/loggerConfig')(module);



module.exports = (dbConnection) => {
    return async (req, res, next) => {
        try {
            const result = await deviceRepository.findDeviceByOwnerAndName(req.headers.device__owner, req.headers.device_name, dbConnection);
            if(result[0].http_token == req.headers.token){
                logger.info('Token validation successful for device owner: ' + req.headers.device_owner + ' and device name: ' + req.headers.device_name);
                next();
            } else {
                logger.error('Error in token validation middleware:', error);
                res.status(401).send('http auth(token) error');
            }
        } catch (error) {
            logger.error('Error in token validation middleware:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}
   