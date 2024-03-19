const logger = require('../config/loggerConfig')(module);
const configs = require('../config/configs');
const deviceRepository = require('../repository/deviceRepository');

// 공통 에러 로그 기록
function logAndHandleError(socket, error, next) {
    logger.error(`[${socket.id}] Error: ${error.message}`);
    next(error);
}


// 미들웨어(1): 클라이언트 소켓이 서버 소켓과 연결하기 위한 필수정보가 있는지 포함되어있는지 확인하는 로직
function checkRequiredInfo(socket) {
    
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

    if (!allInfoProvided) {
        const missingInfo = requiredSocketInfo.filter(info => !socket[info]).join(', ');
        throw new Error(`Missing socket information: ${missingInfo}`);
    }
    
}

// 미들웨어(2): 클라이언트 요청 소켓의 제조사가 'AvalveFarm'인지 확인
function checkManufacturer(socket) {
    if(socket.clientSmartFarmManufacturer !== configs.smartFarmManufacturer){
        throw new Error(`Client's SmartFarm manufacturer not match`);
    }
}

// 미들웨어(3): 클라이언트 소켓의 정보가 서버 측 데이터베이스에 device_owner_id와 device_name, device_uuid와 일치하는지 확인
async function checkDeviceOwnerIdAndDeviceNameAndUuid(socket, dbConnection) {
    const deviceResult = await deviceRepository.findDeviceNameByOwnerId(socket.clientDeviceOwnerId, socket.clientDeviceName, dbConnection);
    if (deviceResult.length === 0 || socket.clientDeviceUuid !== deviceResult[0].device_uuid) {
        throw new Error("Device not found or UUID not match");
    }
}

// 미들웨어(4): 데이터베이스에 접속준비가 가능한 상태로 변경 session_exist: 0 -> 1
async function activateDatabaseSessionExist(socket, dbConnection) {
    const deviceResult = await deviceRepository.findDeviceNameByOwnerId(socket.clientDeviceOwnerId, socket.clientDeviceName, dbConnection);
    if (deviceResult[0].session_exist === 0 && deviceResult[0].per_access === 1) {
        await deviceRepository.updateSessionStatus(socket.clientDeviceOwnerId, socket.clientDeviceName, dbConnection);
    } else {
        throw new Error("Failed to set access permission for device");
    }
}


module.exports = (io, dbConnection) => {
    io.use(async (socket, next) => {
        try {
            checkRequiredInfo(socket);
            checkManufacturer(socket);
            await checkDeviceOwnerIdAndDeviceNameAndUuid(socket, dbConnection);
            await activateDatabaseSessionExist(socket, dbConnection);
            logger.info(`Device ${socket.clientDeviceOwnerId}-${socket.clientDeviceName} is now ready for access.`);
            next();
        } catch(error) {
            logAndHandleError(socket, error, next);
        }
    })
}