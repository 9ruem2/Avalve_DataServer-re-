
const util = require('util');
const logger = require('../config/loggerConfig')(module);

module.exports = {
    findDeviceByOwnerAndName: async (clientDeviceOwnerId, clientDeviceName, dbConnection) => {
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

    initializeDeviceState: async (clientDeviceOwnerId, clientDeviceName, dbConnection) => {
        const sql = 'UPDATE DEVICES SET HTTP_token = ?, Session_exist = ? WHERE Device_owner_id = ? AND Device_name = ?';
        const params = [null, 0, clientDeviceOwnerId, clientDeviceName];
    
        try {
            const [result] = await dbConnection.query(sql, params);
            return result; 
        } catch (err) {
            logger.error(`Failed to initialize client status for device '${clientDeviceOwnerId}-${clientDeviceName}' in the database. Error: ${err}`);
            throw err;
        }
    },
      

    refreshDbConnection: async (dbConnection) => {
        const query = util.promisify(dbConnection.query).bind(dbConnection);

        try {
            const results = await query('SELECT 1');
            console.log('Keepalive query succeeded');
            return results;
        } catch (err) {
            console.error('Keepalive query failed:', err);
            throw err;
        }
    }
};
