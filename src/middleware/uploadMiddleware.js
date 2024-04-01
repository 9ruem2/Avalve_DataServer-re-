const deviceRepository = require("../repository/deviceRepository");
const logger = require('../config/loggerConfig')(module);
const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
    logger.error('Redis Client Error', err);
});

const util = require('util');
const getAsync = util.promisify(client.get).bind(client);
const setAsync = util.promisify(client.set).bind(client);

module.exports = function setupUploadMiddleware(dbConnection) {
    return async (req, res, next) => {
        const uuidToken = req.headers.token;
        const cachedKey = `auth:${uuidToken}`;

        try {
            const cachedData = await getAsync(cachedKey);

            if (cachedData) {
                // 캐시된 데이터가 있으면 바로 다음 미들웨어로
                return next();
            }
        } catch (redisError) {
            // Redis 오류 처리
            logger.error(`Redis error: ${redisError.message}. Falling back to DB.`);
        }

        // Redis에서 데이터를 가져오지 못했거나 오류가 발생한 경우, DB에서 조회
        try {
            const result = await deviceRepository.findDeviceNameByOwnerId(req.headers.device_owner, req.headers.device_name, dbConnection);
            
            if (result.length > 0 && result[0].http_token === uuidToken) {
                logger.info(`Token validation successful for device owner: ${req.headers.device_owner} and device name: ${req.headers.device_name}`);
                
                // DB 조회 결과를 Redis에 저장
                await setAsync(cachedKey, JSON.stringify(result[0]), 'EX', 1800); // 30분 동안 캐시 유지
                return next();
            } else {
                throw new Error('HTTP auth (token) error');
            }
        } catch (error) {
            logger.error(`Error in upload middleware: ${error.message}`);
            res.status(401).send(error.message);
        }
    };
};

/*
Redis 적용 전 코드

// token이 일치하는지 확인하는 로직
module.exports = function setupUploadMiddleware(dbConnection) {
    return async (req, res, next) => {
        try {
            const result = await deviceRepository.findDeviceNameByOwnerId(req.headers.device_owner, req.headers.device_name, dbConnection);
            if (result.length > 0 && result[0].http_token == req.headers.token) {
                logger.info(`Token validation successful for device owner: ${req.headers.device_owner} and device name: ${req.headers.device_name}`);
                next();
            } else {
                logger.error(`Token validation failed for device owner: ${req.headers.device_owner} and device name: ${req.headers.device_name}`);
                res.status(401).send('HTTP auth (token) error');
            }
        } catch (error) {
            logger.error('Error in token validation middleware:', error);
            res.status(500).send('Internal Server Error');
        }
    };
};
*/
