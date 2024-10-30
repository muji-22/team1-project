// database/connect.js
import mysql from 'mysql2/promise'
import 'dotenv/config'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,  // 使用現有的資料庫名稱
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