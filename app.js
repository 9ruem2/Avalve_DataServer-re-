const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const errorHandler = require('./infrastructure/errorHandling/errorHandler');
const logger = require('./infrastructure/logger');
const configs = require('./config/configs');
const db = require('./repository/deviceRepository');
const dbConfigs = requie('./config/dbConfigs')


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(errorHandler);

db.connect();

socketEvents(io);


const PORT = configs.HTTP_PORT;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));



/*
필요한 모듈 import
데이터베이스 설정 객체 생성 및 초기화
express애플리케이션 생성
http서버 생성
socket.io 초기화

db초기화
미들웨어 실행
라우터 연결 
port번호 설정

*/