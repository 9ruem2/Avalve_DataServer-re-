const deviceRepository = require('../repository/deviceRepository');
const logger = require('../config/loggerConfig')(module);
const uuid = require('uuid');

exports.generateAndRegisterToken = async (socket, io, dbConnection ) => {
    try {
        const uuidToken = uuid.v4();
        logger.info(`${socket.clientDeviceOwnerId}-${socket.clientDeviceName} new token: ${uuidToken}`);
        await deviceRepository.saveToken(socket.clientDeviceOwnerId, socket.clientDeviceName, uuidToken, dbConnection );
        io.to(socket.id).emit('upload_start', uuidToken);
    } catch (error) {
        logger.error(`Failed to generate or register token for ${socket.clientDeviceOwnerId}-${socket.clientDeviceName}. Error: ${error.message}`);
    }
};