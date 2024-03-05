const mysql = require('mysql');
const util = require('util'); // util 모듈 추가
const configs = require('./configs');
const logger = require('./logger');
const dbInfo = { 
  host: configs.DB_HOST,
  user: configs.DB_USER,
  password: configs.DB_PASSWORD,
  database: configs.DB_NAME
};

const dbConfig = {
  initializeDatabase: async () => {
    try {
      const connection = mysql.createConnection(dbInfo); 

      const connectAsync = util.promisify(connection.connect).bind(connection);
      const queryAsync = util.promisify(connection.query).bind(connection);

      await connectAsync();
      logger.info('MySQL is connected');

      const sql = 'UPDATE DEVICES SET Session_exist = REPLACE(Session_exist, "1","0")';
      await queryAsync(sql);
      logger.info("DB init success");

      return connection;
    } catch (err) {
      logger.error('Initialization failed: ' + err.message);
      throw err;
    }
  }
};

module.exports = dbConfig;
