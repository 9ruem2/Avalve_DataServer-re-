const mysql = require('mysql');
const configs = require('./configs'); // 가정한 설정 파일
const logger = require('./logger'); // 로거 설정

const dbInfo = {
  host: configs.DB_HOST,
  user: configs.DB_USER,
  password: configs.DB_PASSWORD,
  database: configs.DB_NAME
};

exports.createConnection = () => {
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

exports.disconnect = (connection) => {
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
