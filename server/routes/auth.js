// routes/auth.js
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'

const router = express.Router()

// 登入
router.post('/login', async (req, res) => {
  try {
    const { account, password, remember } = req.body

    // 查詢使用者
    const [users] = await pool.query(
      'SELECT * FROM users WHERE account = ? AND valid = 1',
      [account]
    )
    
    if (users.length === 0) {
      return res.status(401).json({ message: '帳號或密碼錯誤' })
    }

    const user = users[0]

    // 驗證密碼
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ message: '帳號或密碼錯誤' })
    }

    // 產生 JWT token
    const token = jwt.sign(
      {
        id: user.id,
        account: user.account,
        role: user.role || 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: remember ? '7d' : '24h' }
    )

    res.json({
      message: '登入成功',
      token,
      user: {
        id: user.id,
        account: user.account,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('登入錯誤:', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

// 註冊
router.post('/register', async (req, res) => {
  try {
    const { email, account, password, name, phone, birthday, address } = req.body

    // 檢查帳號和信箱是否已存在
    const [existing] = await pool.query(
      'SELECT * FROM users WHERE account = ? OR email = ?',
      [account, email]
    )

    if (existing.length > 0) {
      const field = existing[0].account === account ? '帳號' : '信箱'
      return res.status(400).json({ message: `此${field}已被使用` })
    }

    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10)

    // 新增使用者
    const [result] = await pool.query(
      `INSERT INTO users (email, account, password, name, phone, birthday, address, valid)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [email, account, hashedPassword, name, phone, birthday, address]
    )

    res.status(201).json({
      message: '註冊成功',
      userId: result.insertId
    })
  } catch (error) {
    console.error('註冊錯誤:', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

// 檢查 token
router.get('/check', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user })
})

// 取得使用者資料
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, account, name, email, phone, birthday, address, avatar_url FROM users WHERE id = ?',
      [req.user.id]
    )

    if (users.length === 0) {
      return res.status(404).json({ message: '使用者不存在' })
    }

    res.json(users[0])
  } catch (error) {
    console.error('取得資料錯誤:', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

export default router