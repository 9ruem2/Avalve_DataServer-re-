// dbConfig.js
const mysql = require('mysql');
const configs = require('./configs');
const logger = require('./logger');

const dbInfo = {
  host: configs.DB_HOST,
  user: configs.DB_USER,
  password: configs.DB_PASSWORD,
  database: configs.DB_NAME
};

const createConnection = () => {
  const connection = mysql.createConnection(dbInfo);
  connection.connect(err => {
    if (err) {
      logger.error('MySQL connection error: ' + err);
      return;
    }
    logger.info('MySQL is connected');
  });
  return connection;
};

const disconnect = (connection) => {
  if (connection) {
    connection.end(err => {
      if (err) {
        logger.error('MySQL disconnection error: ' + err);
        return;
      }
      logger.info('MySQL is disconnected');
    });
  }
};

const init = (connection) => {
  // 데이터베이스 초기화 로직, 테이블 생성 등
  const initQueries = [
    'CREATE TABLE IF NOT EXISTS ...;',
  ];

  initQueries.forEach(query => {
    connection.query(query, (err, results) => {
      if (err) {
        logger.error('Error during database initialization: ' + err);
        return;
      }
    });
  });
};

module.exports = {
  createConnection,
  disconnect,
  init
};
