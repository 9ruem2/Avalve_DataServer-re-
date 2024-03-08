const deviceRepository = require('../repository/deviceRepository');
const logger = require('../config/loggerConfig');
const uuid = require('uuid');

exports.generateAndRegisterToken = async (socket, io, dbConnection ) => {
    try {
        logger.info("%s-%s upload start", socket.owner, socket.name);
        const uuidToken = uuid.v4();
        logger.info("%s-%s new token: %s", socket.owner, socket.name, uuidToken);
        await deviceRepository.saveToken(socket.owner, socket.name, uuidToken, dbConnection );
        io.to(socket.id).emit('upload_start', uuidToken);
    } catch {
        logger.error(`Failed to generate or register token for ${socket.owner}-${socket.name}. Error: ${error.message}`);
    }
};