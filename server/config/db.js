// database/connect.js
import mysql from 'mysql2/promise'
import 'dotenv/config'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,  // 使用現有的資料庫名稱
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings:true
})

// 測試連線並印出更多資訊
pool.getConnection()
  .then(connection => {
    console.log('資料庫連線成功')
    console.log('資料庫資訊:', {
      host: connection.config.host,
      user: connection.config.user,
      database: connection.config.database
    })
    connection.release()
  })
  .catch(error => {
    console.error('資料庫連線失敗:', error.message)
    console.error('錯誤詳情:', error)
  })


export default pool