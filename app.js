const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const socketRouter = require('./src/routes/socketRoutes');
const setupSocketAuthMiddleware = require('./src/middleware/socketMiddleware');
const logger = require('./src/infrastructure/logger/logger')(module);
const configs = require('./src/config/configs');
const dbConfig = require('./src/config/dbConfig');

const app = express();



// 서버 시작 로직을 비동기 함수로 처리
async function startServer() { 
    try {
        // 데이터베이스 초기화, 연결
        const conn = await dbConfig.initializeDatabase();
        logger.info('Database successfully initialized');

        // HTTP 서버 및 소켓 서버 설정
        const server = http.createConnection(app);
        const io = socketIo(server);

        // socketMiddleware 실행
        const socketMiddleware = setupSocketAuthMiddleware(io,conn);
        io.use(socketMiddleware);
        
        // socket 'connetion'이벤트 발생
        io.on('connection', (socket) => {
            logger.info(`${socket.owner}-${socket.name} connected`);
            
            // 라우터 실행 시작
            // socketRouter(socket);
        });

        // 서버 시작
        const PORT = configs.PORT;
        server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
        
    } catch (err) {
        logger.error('Failed to start server:', err);
    }
}

startServer();





