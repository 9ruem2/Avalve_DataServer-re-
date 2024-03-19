const mysql = require('mysql');
const util = require('util'); 
const configs = require('./configs');
const logger = require('./loggerConfig')(module);
const dbInfo = { 
  host: configs.database.host,
  user: configs.database.user,
  password: configs.database.password,
  database: configs.database.name
};

const dbConfig = {
  // 데이터베이스 생성 및 Session_exist 0으로 초기화
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
