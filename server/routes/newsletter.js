// routes/newsletter.js
import express from 'express'
import pool from '../config/db.js'
import { sendWelcomeEmail } from '../services/emailService.js'

const router = express.Router()

// 訂閱電子報
router.post('/subscribe', async (req, res) => {
  const { email } = req.body

  // 驗證 email 格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: '無效的電子郵件格式'
    })
  }

  try {
    // 檢查是否已訂閱
    const [existingSubscriber] = await pool.execute(
      'SELECT * FROM newsletters WHERE email = ?',
      [email]
    )

    if (existingSubscriber.length > 0) {
      // 如果已存在但狀態為取消訂閱，則更新狀態
      if (existingSubscriber[0].status === 0) {
        await pool.execute(
          'UPDATE newsletters SET status = 1 WHERE email = ?',
          [email]
        )
        // 重新訂閱也發送歡迎郵件
        try {
          await sendWelcomeEmail(email)
        } catch (emailError) {
          console.error('重新訂閱歡迎郵件發送失敗:', emailError)
        }
        return res.json({
          status: 'success',
          message: '已重新訂閱電子報！'
        })
      }
      return res.status(400).json({
        status: 'error',
        message: '此信箱已訂閱過電子報'
      })
    }

    // 新增訂閱者
    await pool.execute(
      'INSERT INTO newsletters (email) VALUES (?)',
      [email]
    )

    // 發送歡迎郵件
    try {
      await sendWelcomeEmail(email)
      res.json({
        status: 'success',
        message: '成功訂閱電子報！歡迎郵件已發送至您的信箱'
      })
    } catch (emailError) {
      console.error('發送歡迎郵件失敗:', emailError)
      res.json({
        status: 'success',
        message: '成功訂閱電子報！但歡迎郵件發送失敗，請檢查郵箱設定'
      })
    }

  } catch (error) {
    console.error('訂閱電子報錯誤:', error)
    res.status(500).json({
      status: 'error',
      message: '訂閱過程發生錯誤，請稍後再試'
    })
  }
})

// 取消訂閱電子報
router.post('/unsubscribe', async (req, res) => {
  const { email } = req.body

  try {
    const [result] = await pool.execute(
      'UPDATE newsletters SET status = 0 WHERE email = ?',
      [email]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此訂閱信箱'
      })
    }

    res.json({
      status: 'success',
      message: '已成功取消訂閱'
    })
  } catch (error) {
    console.error('取消訂閱錯誤:', error)
    res.status(500).json({
      status: 'error',
      message: '取消訂閱過程發生錯誤，請稍後再試'
    })
  }
})

export default router