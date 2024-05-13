const express = require('express');
const router = express.Router();
const tokenController = require('../controller/tokenController');

// 클라이언트 소켓에서 서버측 소켓에 make_token이벤트를 발생시킴
module.exports = (socket, io, dbConnection ) => {
    socket.on('make_token', (data) => {
        tokenController.makeToken(socket, io, dbConnection );
        console.log(`Received make_token event with data: ${data}`);
    });
};
