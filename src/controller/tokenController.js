const tokenService = require('../service/tokenService');


exports.makeToken = (socket, io, dbConnection ) => {
    tokenService.generateAndRegisterToken(socket, io, dbConnection );
};


