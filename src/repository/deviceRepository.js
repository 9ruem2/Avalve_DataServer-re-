
module.exports = {
    findDeviceByOwnerAndName: (clientDeviceOwnerId, clientDeviceName, dbConnection) => {
        const sql = 'SELECT * FROM DEVICES WHERE Device_owner_id = ? AND Device_name = ?';
        const params = [clientDeviceOwnerId, clientDeviceName];
        
        return new Promise((resolve, reject) => {
            dbConnection.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    updateSessionStatus: async (clientDeviceOwnerId, clientDeviceName, dbConnection) => {
        const sql = 'UPDATE DEVICES SET Session_exist = 1 WHERE Device_owner_id = ? AND Device_name = ?';
        const params = [clientDeviceOwnerId, clientDeviceName];

        return new Promise((resolve, reject) => {
            dbConnection.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    saveToken: async (clientDeviceOwnerId,clientDeviceName,uuidToken,dbConnection) => {
        const sql = 'UPDATE DEVICES SET http_token = ? WHERE device_owner_id = ? AND device_name = ?';
        const params = [uuidToken, clientDeviceOwnerId, clientDeviceName];

        return new Promise((resolve, reject) => {
            dbConnection.query(sql, params, (err, result) => {
                if (err) {
                    logger.error(`Error saving token for device ${clientDeviceName} owned by ${clientDeviceOwnerId}. Error: ${err.message}`);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
       });
    }
};

