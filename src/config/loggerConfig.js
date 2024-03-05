const winston = require('winston');
const winstonDaily =require('winston-daily-rotate-file');
const moment = require('moment-timezone');
const path = require('path');

const logDir = 'logs';
const { format } = winston;
const { combine, timestamp, printf, label } = format;

// 타임스탬프 포맷 설정
const timeStampFormat = () => moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss:ms');

// 로그 메시지 포맷 설정
// return: 2024-03-05 12:34:56 [app.js] INFO: User login successful
const logFormat = printf(({ timestamp, label, level, message }) => {
    return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
});
  
// 로그를 남기는 해당 모듈의 이름을 로그에 포함하는 설정
const getModuleName = function(module) {
    return path.basename(module.filename);
};


module.exports = function(module) {
    return winston.createLogger({
        format: combine(
            timestamp({
            format: timeStampFormat, 
            }),
            label({ label: getModuleName(module) }), 
            logFormat
        ),
        transports: [
            new winston.transports.Console(),
            new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%_info.log`,
            maxFiles: '30d',
            }),
            new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%_error.log`,
            maxFiles: '30d',
            }),
        ],
    });
};