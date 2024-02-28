const deviceRepository = require('../repository/deviceRepository');

exports.listDevices = async () => {
    return deviceRepository.findAll();
};

exports.registerDevice = async (deviceData) => {
    return deviceRepository.create(deviceData);
};
