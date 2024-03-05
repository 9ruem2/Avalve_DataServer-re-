
module.exports = {
    findDeviceByOwnerAndName: (deviceOwnerId, deviceName, conn) => {
        const sql = 'SELECT * FROM DEVICES WHERE Device_owner_id = ? AND Device_name = ?';
        const params = [deviceOwnerId, deviceName];
        
        return new Promise((resolve, reject) => {
            conn.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    updateSessionStatus: async (deviceOwnerId, deviceName, conn) => {
        const sql = 'UPDATE DEVICES SET Session_exist = 1 WHERE Device_owner_id = ? AND Device_name = ?';
        const params = [deviceOwnerId, deviceName];

        return new Promise((resolve, reject) => {
            conn.query(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
};

