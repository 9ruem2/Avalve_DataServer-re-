const db = require('../infrastructure/database');

exports.findAll = async () => {
    const devices = await db.query('SELECT * FROM devices');
    return devices.rows;
};

exports.create = async (deviceData) => {
    const { name, type } = deviceData;
    const result = await db.query('INSERT INTO devices (name, type) VALUES ($1, $2) RETURNING *', [name, type]);
    return result.rows[0];
};
