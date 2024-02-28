const deviceService = require('../service/deviceService');

exports.listDevices = async (req, res) => {
    const devices = await deviceService.listDevices();
    res.json(devices);
};

exports.registerDevice = async (req, res) => {
    const { name, type } = req.body;
    const device = await deviceService.registerDevice({ name, type });
    res.status(201).json(device);
};
