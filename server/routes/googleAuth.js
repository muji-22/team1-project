// routes/googleAuth.js
import express from 'express'
import pool from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/login', async (req, res) => {
  const conn = await pool.getConnection()
  try {
    console.log('收到 Google 登入請求:', req.body)
    const { email, name, googleId, avatar_url } = req.body

    // 驗證必要欄位
    if (!email || !name || !googleId) {
      console.log('缺少必要欄位:', { email, name, googleId })
      return res.status(400).json({
        status: 'error',
        message: '缺少必要資料'
      })
    }

    // 1. 檢查用戶是否已存在
    const [users] = await conn.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    console.log('資料庫查詢結果:', users)

    let userId
    let user

    if (users.length === 0) {
      // 2. 如果用戶不存在，創建新用戶
      const randomSuffix = Math.floor(Math.random() * 10000)
      const account = `${email.split('@')[0]}_${randomSuffix}`
      
      const randomPassword = Math.random().toString(36).slice(-8)
      const hashedPassword = await bcrypt.hash(randomPassword, 10)

      // 插入新用戶
      const [result] = await conn.query(
        `INSERT INTO users 
         (email, account, password, name, avatar_url, valid) 
         VALUES (?, ?, ?, ?, ?, 1)`,
        [email, account, hashedPassword, name, avatar_url]
      )

      userId = result.insertId
      
      // 獲取新創建的用戶資料
      const [newUser] = await conn.query(
        'SELECT id, account, name, email, avatar_url FROM users WHERE id = ?',
        [userId]
      )
      user = newUser[0]

    } else {
      // 3. 如果用戶已存在，更新資料
      user = users[0]
      userId = user.id
      
      // 更新用戶資料
      await conn.query(
        `UPDATE users 
         SET name = ?, avatar_url = ?, valid = 1
         WHERE id = ?`,
        [name, avatar_url, userId]
      )

      // 重新獲取更新後的用戶資料
      const [updatedUser] = await conn.query(
        'SELECT id, account, name, email, avatar_url FROM users WHERE id = ?',
        [userId]
      )
      user = updatedUser[0]
    }

    // 4. 生成 JWT token
    const token = jwt.sign(
      {
        id: userId,
        email: email,
        name: name
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 5. 回傳結果
    const safeUser = {
      id: userId,
      account: user.account,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url
    }

    console.log('登入成功，返回數據:', {
      status: 'success',
      user: safeUser
    })

    res.json({
      status: 'success',
      message: 'Google 登入成功',
      token,
      user: safeUser
    })

  } catch (error) {
    console.error('Google 登入詳細錯誤:', {
      message: error.message,
      stack: error.stack,
      error
    })
    res.status(500).json({ 
      status: 'error',
      message: 'Google 登入失敗',
      error: error.message 
    })
  } finally {
    if (conn) conn.release()
  }
})

export default router