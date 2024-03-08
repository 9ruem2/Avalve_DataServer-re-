const mysql = require('mysql');

module.exports = {
    findDeviceByOwnerAndName: (clientDeviceOwnerId, clientDeviceName, dbConfig) => {
        const sql = 'SELECT * FROM DEVICES WHERE Device_owner_id = ? AND Device_name = ?';
        const params = [clientDeviceOwnerId, clientDeviceName];
        
        return new Promise((resolve, reject) => {
            dbConfig.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    updateSessionStatus: async (clientDeviceOwnerId, clientDeviceName, dbConfig) => {
        const sql = 'UPDATE DEVICES SET Session_exist = 1 WHERE Device_owner_id = ? AND Device_name = ?';
        const params = [clientDeviceOwnerId, clientDeviceName];

        return new Promise((resolve, reject) => {
            dbConfig.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    saveToken: async (clientDeviceOwnerId,clientDeviceName,uuidToken,dbConfig) => {
        const sql = 'UPDATE DEVICES SET http_token = ? WHERE device_owner_id = ? AND device_name = ?';
        const params = [uuidToken, clientDeviceOwnerId, clientDeviceName];

        return new promise ((resolve, reject) => {
            dbConfig.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
       });
    }
};

