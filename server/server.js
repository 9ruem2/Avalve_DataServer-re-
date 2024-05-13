// const http = require('http');
// const socketIo = require('socket.io');

// const logger = require('../src/config/loggerConfig')(module);
// const configs = require('../src/config/configs');
// const dbConfig = require('../src/config/dbConfig');
// const tokenRouter = require('../src/routes/tokenRouter');
// const deviceRepository = require('../src/repository/deviceRepository');
// const { app, setupProtectedRoutes } = require('./app');
// const setupSocketAuthMiddleware = require('../src/middleware/socketMiddleware');

// async function startServer() {
//     try {
//         // 데이터베이스 초기화, 연결
//         const dbConnection  = await dbConfig.initializeDatabase();
//         logger.info('Database successfully initialized');


//         // HTTP 서버 및 소켓 서버 설정
//         const server = http.createServer(app);
//         const io = socketIo(server);

//         // socketMiddleware 실행
//         const socketMiddleware = setupSocketAuthMiddleware(io,dbConnection );
//         io.use(socketMiddleware);
        
//         setupProtectedRoutes(dbConnection);

//         // socket 'connetion'이벤트 발생
//         io.on('connection', (socket) => {
//             logger.info(`${socket.clientDeviceOwnerId}-${socket.clientDeviceName} connected`);

//             // token생성 및 등록과 관련한 라우터 실행
//             tokenRouter(socket,io,dbConnection);

//              // 클라이언트 소켓 연결 끊김, 토큰 초기화
//             socket.on('disconnect', () => {
//             deviceRepository.initializeDeviceState(socket.clientDeviceOwnerId, socket.clientDeviceName, dbConnection);
//             logger.info(`${socket.clientDeviceOwnerId}-${socket.clientDeviceName} disconnected and client status reset`);
//             });

//         // 데이터베이스 연결을 활성 상태로 유지하기 위한 refreshDbConnection 로직 실행
//         setInterval(() => {
//             deviceRepository.refreshDbConnection(dbConnection)
//                 .then(() => logger.info('refreshDbConnection executed successfully.'))
//                 .catch(err => logger.error('refreshDbConnection execution failed:', err));
//         }, 1000 * 60 * 5);

//         // 서버 시작
//         const PORT = configs.server.port;
//         server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
//         });

            

//     } catch (err) {
//         logger.error('Failed to start server:', err);
//     }
// }

// startServer();
