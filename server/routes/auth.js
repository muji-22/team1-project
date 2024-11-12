// routes/auth.js
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import transporter from '../config/mail.js'
import crypto from 'crypto'

const router = express.Router()

// 登入
router.post('/login', async (req, res) => {
  try {
    const { account, password } = req.body

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
      { expiresIn: req.body.remember ? '7d' : '24h' }
    )

    // 清除敏感資訊並加入其他需要的資料
    const safeUser = {
      id: user.id,
      account: user.account,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      avatar_url: user.avatar_url,
      phone: user.phone,
      birthday: user.birthday,
      address: user.address
    }

    res.json({
      message: '登入成功',
      token,
      user: safeUser
    })
  } catch (error) {
    console.error('登入錯誤:', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

// 登出
router.post('/logout', authenticateToken, (req, res) => {
  try {
    res.json({ message: '登出成功' })
  } catch (error) {
    console.error('登出錯誤:', error)
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
router.get('/check', authenticateToken, async (req, res) => {
  try {
    // 從資料庫獲取最新的使用者資料
    const [users] = await pool.query(
      'SELECT id, account, name, email, phone, birthday, address, avatar_url FROM users WHERE id = ?',
      [req.user.id]
    )

    if (users.length === 0) {
      return res.status(404).json({ message: '使用者不存在' })
    }

    const safeUser = {
      ...users[0],
      role: req.user.role || 'user'
    }

    res.json({ 
      valid: true, 
      user: safeUser 
    })
  } catch (error) {
    console.error('檢查認證錯誤:', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
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

// 更新使用者資料
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, birthday, address } = req.body

    // 檢查 email 是否被其他用戶使用
    if (email) {
      const [existingUsers] = await pool.query(
        'SELECT * FROM users WHERE email = ? AND id != ?',
        [email, req.user.id]
      )
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: '此信箱已被使用' })
      }
    }

    // 更新用戶資料
    const [result] = await pool.query(
      `UPDATE users 
       SET name = ?, email = ?, phone = ?, birthday = ?, address = ?
       WHERE id = ?`,
      [name, email, phone, birthday, address, req.user.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '使用者不存在' })
    }

    // 取得更新後的用戶資料
    const [updatedUser] = await pool.query(
      'SELECT id, account, name, email, phone, birthday, address, avatar_url FROM users WHERE id = ?',
      [req.user.id]
    )

    res.json({ 
      message: '資料更新成功',
      user: updatedUser[0]
    })
  } catch (error) {
    console.error('更新資料錯誤:', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

// 更改密碼
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // 驗證當前密碼
    const [users] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    )

    if (users.length === 0) {
      return res.status(404).json({ message: '使用者不存在' })
    }

    const validPassword = await bcrypt.compare(currentPassword, users[0].password)
    if (!validPassword) {
      return res.status(401).json({ message: '當前密碼錯誤' })
    }

    // 雜湊新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 更新密碼
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    )

    res.json({ message: '密碼更新成功' })
  } catch (error) {
    console.error('更改密碼錯誤:', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

// 設定檔案儲存
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 設定儲存路徑
    cb(null, 'public/avatar')
  },
  filename: (req, file, cb) => {
    // 確保檔名是唯一的，並保留原始副檔名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

// 設定檔案過濾
const fileFilter = (req, file, cb) => {
  // 只允許 image 類型
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('只允許上傳圖片檔案！'), false)
  }
}

// 設定 multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 限制 5MB
  }
})

// 上傳大頭貼
router.post('/upload-avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '請選擇要上傳的圖片' })
    }

    // 處理舊的大頭貼檔案
    const [user] = await pool.query(
      'SELECT avatar_url FROM users WHERE id = ?',
      [req.user.id]
    )

    if (user[0].avatar_url) {
      const oldPath = path.join('public', user[0].avatar_url)
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    // 設定新的大頭貼路徑 (存入資料庫的是相對路徑)
    const avatarUrl = `/avatar/${req.file.filename}`

    // 更新資料庫
    await pool.query(
      'UPDATE users SET avatar_url = ? WHERE id = ?',
      [avatarUrl, req.user.id]
    )

    res.json({
      message: '大頭貼上傳成功',
      avatar_url: avatarUrl
    })

  } catch (error) {
    console.error('上傳大頭貼錯誤:', error)
    res.status(500).json({ 
      message: error.message || '上傳大頭貼失敗'
    })
  }
})

// 忘記密碼請求
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // 檢查信箱是否存在
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND valid = 1',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '此信箱未註冊' });
    }

    // 生成臨時密碼
    const tempPassword = crypto.randomBytes(4).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 更新資料庫中的密碼
    await pool.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    // 發送郵件
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '密碼重置通知',
      html: `
        <h1>密碼重置</h1>
        <p>您的臨時密碼是: <strong>${tempPassword}</strong></p>
        <p>請使用此臨時密碼登入後立即更改您的密碼。</p>
        <p>如果這不是您本人的操作，請立即聯繫我們。</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: '新密碼已發送至您的信箱' });
  } catch (error) {
    console.error('忘記密碼處理錯誤:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

export default router