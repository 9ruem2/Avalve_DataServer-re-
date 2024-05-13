const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const tokenRouter = require('./src/routes/tokenRouter');
const setupUploadRouter = require('./src/routes/uploadRoutes');
const setupSocketAuthMiddleware = require('./src/middleware/socketMiddleware');
const logger = require('./src/config/loggerConfig')(module);
const configs = require('./src/config/configs');
const dbConfig = require('./src/config/dbConfig');
const setupUploadMiddleware = require('./src/middleware/uploadMiddleware');
const deviceRepository = require('./src/repository/deviceRepository');

const app = express();



// 서버 시작 로직을 비동기 함수로 처리
async function startServer() { 
    try {
        // 데이터베이스 초기화, 연결
        const dbConnection  = await dbConfig.initializeDatabase();
        logger.info('Database successfully initialized');

        // HTTP 서버 및 소켓 서버 설정
        const server = http.createServer(app);
        const io = socketIo(server);

        // socketMiddleware 실행
        const socketMiddleware = setupSocketAuthMiddleware(io,dbConnection );
        io.use(socketMiddleware);
        
        // socket 'connetion'이벤트 발생
        io.on('connection', (socket) => {
            logger.info(`${socket.clientDeviceOwnerId}-${socket.clientDeviceName} connected`);

            // token생성 및 등록과 관련한 라우터 실행
            tokenRouter(socket,io,dbConnection);


             // 클라이언트 소켓 연결 끊김, 토큰 초기화
            socket.on('disconnect', () => {
            deviceRepository.initializeDeviceState(socket.clientDeviceOwnerId, socket.clientDeviceName, dbConnection);
            logger.info(`${socket.clientDeviceOwnerId}-${socket.clientDeviceName} disconnected and client status reset`);
            });
        });

        // 라우터처리를 위한 파싱
        app.use(express.json())
        app.use(express.urlencoded({extended : true}));

        // '/upload'로 진입하기 전 토큰값을 체크하는 미들웨어처리
        const uploadMiddleware = setupUploadMiddleware(dbConnection);

        // '/upload' 라우터 등록
        const uploadRouter = setupUploadRouter(dbConnection);
        app.use('/uploads', uploadMiddleware, uploadRouter);

        // 데이터베이스 연결을 활성 상태로 유지하기 위한 refreshDbConnection 로직 실행
        setInterval(() => {
            deviceRepository.refreshDbConnection(dbConnection)
                .then(() => logger.info('refreshDbConnection executed successfully.'))
                .catch(err => logger.error('refreshDbConnection execution failed:', err));
        }, 1000 * 60 * 5);

        // 서버 시작
        const PORT = configs.server.port;
        server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
        
    } catch (err) {
        logger.error('Failed to start server:', err);
    }
}

startServer();





//테스트 코드를 위한 app.js, server.js 분리
// const express = require('express');
// const setupUploadRouter = require('../src/routes/uploadRoutes');
// const setupUploadMiddleware = require('../src/middleware/uploadMiddleware');

// const app = express();

// app.use(express.json())
// app.use(express.urlencoded({extended : true}));


// // 라우터처리를 위한 파싱
// function setupProtectedRoutes(dbConnection) {
//     // '/upload'로 진입하기 전 토큰값을 체크하는 미들웨어처리
//     const uploadMiddleware = setupUploadMiddleware(dbConnection);
    
//     // '/upload' 라우터 등록
//     const uploadRouter = setupUploadRouter(dbConnection);
//     app.use('/uploads', uploadMiddleware, uploadRouter);
// }


// module.exports = {app,setupProtectedRoutes};