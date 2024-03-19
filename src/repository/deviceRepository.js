
const util = require('util');
const logger = require('../config/loggerConfig')(module);

module.exports = {
    // 데이터베이스에서 특정 소유자 ID와 기기 이름을 기준으로 검색 ex) 안동이면서 용인 카메라인 것을 조회
    findDeviceNameByOwnerId: async (clientDeviceOwnerId, clientDeviceName, dbConnection) => {
        const sql = 'SELECT * FROM DEVICES WHERE Device_owner_id = ? AND Device_name = ?';
        const params = [clientDeviceOwnerId, clientDeviceName];
        const query = util.promisify(dbConnection.query).bind(dbConnection);

        try {
            const result = await query(sql, params);
            return result;
        } catch (err) {
            throw err;
        }
    },

    updateSessionStatus: async (clientDeviceOwnerId, clientDeviceName, dbConnection) => {
        const sql = 'UPDATE DEVICES SET Session_exist = 1 WHERE Device_owner_id = ? AND Device_name = ?';
        const params = [clientDeviceOwnerId, clientDeviceName];
        const query = util.promisify(dbConnection.query).bind(dbConnection);

        try {
            const result = await query(sql, params);
            return result;
        } catch (err) {
            throw err;
        }
    },

    saveToken: async (clientDeviceOwnerId, clientDeviceName, uuidToken, dbConnection) => {
        const sql = 'UPDATE DEVICES SET http_token = ? WHERE device_owner_id = ? AND device_name = ?';
        const params = [uuidToken, clientDeviceOwnerId, clientDeviceName];
        const query = util.promisify(dbConnection.query).bind(dbConnection);

        try {
            const result = await query(sql, params);
            return result;
        } catch (err) {
            logger.error(`Error saving token for device ${clientDeviceName} owned by ${clientDeviceOwnerId}. Error: ${err.message}`);
            throw err;
        }
    },

    /*
    session_exist(세션 존재 여부)
        1: 소켓이 연결되어 있음
        0: 소켓이 연결되어 있지 않음
    per_access(서버로 접속 가)
         1: 서버로 접속 가능한 상태
         0: 서버로 접속할 수 없는 상태
     */
    initializeDeviceState: async (clientDeviceOwnerId, clientDeviceName, dbConnection) => {
        const sql = 'UPDATE DEVICES SET http_token = ?, http_access = ?, session_exist = ? WHERE device_owner_id = ? AND device_name = ?';
        const params = [null, 0, 0, clientDeviceOwnerId, clientDeviceName];
    
        try {
            const result = await dbConnection.query(sql, params);
            return result; 
        } catch (err) {
            logger.error(`Failed to initialize client status for device '${clientDeviceOwnerId}-${clientDeviceName}' in the database. Error: ${err}`);
            throw err;
        }
    },
      

    refreshDbConnection: async (dbConnection) => {
        const query = util.promisify(dbConnection.query).bind(dbConnection);

        try {
            const result = await query('SELECT 1');
            logger.info('Keepalive query succeeded');
            return result;
        } catch (err) {
            logger.error('Keepalive query failed:', err);
            throw err;
        }
    },

    updateHttpAccessStatusToEnabled: async (clientUuidToken, dbConnection) => {
        const sql = 'UPDATE DEVICES SET http_access = ? WHERE http_token = ?';
        const params = [1, clientUuidToken];
    
        logger.info(`Attempting to enable HTTP access for device with token: ${clientUuidToken}`);
        try {
            const result = await dbConnection.query(sql, params); 
            logger.info(`HTTP access successfully enabled for device with token: ${clientUuidToken}`);
            return result;
        } catch (err) {
            logger.error(`Error enabling HTTP access for device with token: ${clientUuidToken}. Error: ${err.message}`);
            throw err;
        }
    },

    clearHttpAccessByToken: async (clientUuidToken, dbConnection) => {
        const sql = 'UPDATE DEVICES SET HTTP_token = ?, HTTP_access = ? WHERE HTTP_token = ?';
        const params = [null, 0, clientUuidToken];

        try{
            const result = await dbConnection.query(sql, params);
            logger.info("DB init upload status success");
            return result;
        } catch (err) {
            logger.error("An error occurred during the database operation: %s", err.message);
            throw err;
        }
    }
    
};
