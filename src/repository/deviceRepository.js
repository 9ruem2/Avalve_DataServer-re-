const dbConfig = require('./dbConfig');

const initializeDatabase = () => {
    const conn = dbConfig.createConnection();
    
    // 데이터베이스 초기화 쿼리 실행
    const initQueries = [
        `CREATE TABLE IF NOT EXISTS devices (...);`,
        // 필요한 추가 테이블 생성 쿼리
    ];

    initQueries.forEach((query) => {
        conn.query(query, (err, results) => {
            if (err) {
                console.error('Database initialization error:', err);
                return;
            }
            console.log('Database initialization result:', results);
        });
    });

    // 초기화 후 연결 종료가 필요한 경우
    dbConfig.disconnect(conn);
};

// 디바이스 관련 기타 데이터베이스 작업 함수...

module.exports = {
    initializeDatabase,
    // 기타 데이터베이스 작업 함수 export...
};
