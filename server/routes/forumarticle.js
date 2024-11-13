import express from 'express'
import pool from '../config/db.js' // Make sure this is the correct import path

const router = express.Router()
const db = pool

router.get('/test', async (req, res) => {
  res.json({ message: 'testing' })
})

router.get('/', async (req, res) => {
  // console.log('GETING....')
  try {
    const [rows] = await db.query('SELECT * FROM forum_article')
    // console.log('Query result:', rows) // 檢查資料

    res.json(rows) // Send data back to the client as JSON
  } catch (error) {
    console.error('Error type:', error.name)
    console.error('Error message:', error.message)
    console.error('SQL query that caused the error:', error.sql)

    // Send a user-friendly error message without exposing internal details
    res.status(500).json({
      message: 'An error occurred while fetching the articles.',
      error: error.message, // Optional: Expose only the error message to the client
    })
  }
})

// 獲取特定文章的路由
router.get('/article/:id', async (req, res) => {
  try {
    // 從請求參數中獲取文章 id
    const articleId = req.params.id

    // 使用參數化查詢，避免 SQL 注入
    const [content] = await db.query(
      'SELECT * FROM forum_article WHERE id = ?',
      [articleId]
    )

    // 檢查是否找到文章
    if (!content || content.length === 0) {
      return res.status(404).json({
        message: '找不到該文章',
      })
    }

    // 返回文章內容
    res.json(content[0])
  } catch (error) {
    console.error('獲取文章失敗:', error)
    res.status(500).json({
      message: '伺服器錯誤',
      error: error.message,
    })
  }
})

export default router
