const uploadService = require('../service/uploadService');

exports.uploadImage = async (req, res) => {
    const file = req.file;
    const result = await uploadService.uploadImage(file);
    res.json(result);
};

exports.uploadJson = async (req, res) => {
    const file = req.file;
    const result = await uploadService.uploadJson(file);
    res.json(result);
};
