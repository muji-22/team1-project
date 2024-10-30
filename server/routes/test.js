// routes/test.js
import express from 'express'
import pool from '../database/connect.js'
const router = express.Router()

// 測試資料庫連線
router.get('/db', async (req, res) => {
  try {
    const connection = await pool.getConnection()
    connection.release()
    
    res.json({
      status: 'success',
      message: '資料庫連線成功'
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '資料庫連線失敗',
      error: error.message
    })
  }
})

export default router