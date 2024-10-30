// database/connect.js
import mysql from 'mysql2/promise'
import 'dotenv/config'

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "admin",
  password: "admin",
  database: "my_test_db",  // 使用現有的資料庫名稱
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// 測試連線
pool.getConnection()
  .then(connection => {
    console.log('資料庫連線成功'.green)
    connection.release()
  })
  .catch(error => {
    console.error('資料庫連線失敗:'.red, error.message)
  })

export default pool