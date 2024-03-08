const express = require('express');
const router = express.Router();
const tokenController = require('../controller/tokenController');


module.exports = (socket, io, dbConnection ) => {
    socket.on('make_token', (data) => {
        tokenController.makeToken(socket, io, dbConnection );
        console.log(`Received make_token event with data: ${data}`);
    });

    
};
