const logger = require('../config/loggerConfig')(module);
const configs = require('../config/configs');
const deviceRepository = require('../repository/deviceRepository');

module.exports = (io, dbConnection ) => {

    // 미들웨어(1): 서버에 소켓연결을 요청한 소켓(클라이언트 소켓)이 연결에 필요한 필수정보를 포함하고 있는지 여부 
    io.use((socket, next) => {
        try {
            // 소켓 정보 추출
            const headers = socket.handshake.headers;
            const auth = socket.handshake.auth;
            socket.clientSmartFarmManufacturer = headers['manufacturer'];
            socket.clientDeviceModel = headers['device_model'];
            socket.clientDeviceOwnerId = headers['device_owner'];
            socket.clientDeviceName = headers['device_name'];
            socket.clientDeviceUuid = auth['device_uuid'];
            
            // 소켓과 연결하기 위한 필수 정보
            const requiredSocketInfo = ['clientSmartFarmManufacturer', 'clientDeviceOwnerId', 'clientDeviceName'];
    
            // 모든 필수 정보가 있는지 확인하는 메서드
            const allInfoProvided = requiredSocketInfo.every(info => {
                const value = socket[info];
                return value !== undefined && value !== null && value !== '';
            });
    
            if (allInfoProvided) {
                logger.info(`[${socket.id}] ${socket.clientDeviceOwnerId}-${socket.clientDeviceName} connecting`);
                next();
            } else {
                const missingInfo = requiredSocketInfo.filter(info => !socket[info]).join(', ');
                throw new Error(`Missing socket information: ${missingInfo}`);
            }
        } catch (error) {
            logger.error(`[${socket.id}] Error: ${error.message}`);
            next(error);
        }
    });

    // 미들웨어(2): 클라이언트 소켓의 스마트팜 제조사 정보가 설정값과 일치하는지 검사
    io.use((socket, next) => {
        const isManufacturerMatched = socket.clientSmartFarmManufacturer  == configs.smartFarmManufacturer;
        const logContext = `[${socket.id}] ${socket.clientDeviceOwnerId}-${socket.clientDeviceName}`;

        if (isManufacturerMatched) {
            logger.info(`${logContext} Client's SmartFarm manufacturer successfully matched`);
            next();
        } else {
            const error = new Error(`${logContext} Client's SmartFarm manufacturer not match`);
            error.details = {
            actualManufacturer: socket.clientSmartFarmManufacturer ,
            expectedManufacturer: configs.smartFarmManufacturer
            };

            logger.error(error.message);
            next(error);
        }
    });

    // 미들웨어(3): clientDeviceOwnerId와 clientDeviceName이 데이터베이스와 모두 일치하는 레코드가 있는지 확인
    io.use(async (socket, next) => {
        try {
            const deviceResult = await deviceRepository.findDeviceNameByOwnerId(socket.clientDeviceOwnerId, socket.clientDeviceName, dbConnection );
            
            if (deviceResult.length > 0) {
                next();
            } else {
                throw new Error ("Device not found");
            }
        } catch(error) {
            logger.error(`Error in device lookup: ${error.message}`);
            next(error);
        }
    });                                   

    // 미들웨어(4): clientDeviceUuid와 서버에 저장된 DeviceUuid와 일치하는지 확인하는지 확인
    io.use(async (socket, next) => {
        try {
            const deviceResult = await deviceRepository.findDeviceNameByOwnerId(socket.clientDeviceOwnerId, socket.clientDeviceName, dbConnection );
    
            if (socket.clientDeviceUuid == deviceResult[0].device_uuid) {
                // 일치하는 장치가 있고, UUID가 일치하는 경우
                logger.info(`[${socket.clientDeviceUuid}] ${socket.clientDeviceOwnerId}-${socket.clientDeviceName} UUID match`);
                next();
            } else {
                throw new Error(`[${socket.clientDeviceUuid}] ${socket.clientDeviceOwnerId}-${socket.clientDeviceName} UUID not match`);
            }
        } catch (error) {
            logger.error(`${error.message}`);
            next(error);
        }
    });
    
    // 미들웨어(5): 데이터베이스 접속 준비 가능 상태 per_access = 1 && 데이터베이스 접속 된 상태 session_exist = 1
    io.use(async (socket, next) => {
        try {
            const deviceResult = await deviceRepository.findDeviceNameByOwnerId(socket.clientDeviceOwnerId, socket.clientDeviceName, dbConnection );
            console.log(deviceResult);
            sessionExistence = deviceResult[0].session_exist;
            perAccess = deviceResult[0].per_access;

            if(sessionExistence == 0 && perAccess == 1) {
                deviceRepository.updateSessionStatus(socket.clientDeviceOwnerId, socket.clientDeviceName, dbConnection );
                logger.info(`Device ${socket.clientDeviceOwnerId}-${socket.clientDeviceName} is now ready for access.`);
                next();
            } else {
                throw new Error(`Failed to set access permission for device ${socket.clientDeviceOwnerId}-${socket.clientDeviceName}.`);
            }
        } catch (error) {
            logger.error(`${error.message}`);
            next(error);
        }
    });
};