const winston = require('winston');
const logDir = logs;
const winstonDaily = require('winston-daily-rotate-file');


const logger = winston.createLogger({
});

module.exports = logger;
