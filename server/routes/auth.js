// routes/auth.js
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'
import multer from 'multer'
import path from 'path'

const router = express.Router()

// 登入
router.post('/login', async (req, res) => {
  try {
    const { account, password } = req.body
    console.log('Login attempt:', { account, password }) // 除錯用

    // 查詢使用者
    const [users] = await pool.query(
      'SELECT * FROM users WHERE account = ? AND valid = 1',
      [account]
    )
    console.log('Found users:', users) // 除錯用
    
    if (users.length === 0) {
      return res.status(401).json({ message: '帳號或密碼錯誤' })
    }

    const user = users[0]

    // 驗證密碼
    const isValid = await bcrypt.compare(password, user.password)
    console.log('Password validation:', isValid) // 除錯用

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
      avatar_url: user.avatar_url
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

// 設定 大頭貼 用來儲存上傳的圖片
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 儲存圖片的目錄
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // 設定圖片檔名,Date.now()
    cb(null,Date.now()+ path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 更新大頭貼 (只更新 avatar_url)
router.put('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    let avatarUrl = req.user.avatar_url;

    if (req.file) {
      // 如果舊的 avatar_url 存在，刪除舊的檔案
      if (avatarUrl && fs.existsSync(avatarUrl)) {
        fs.unlinkSync(avatarUrl);  // 刪除舊的圖片檔案
      }

      // 設定新檔案的路徑
      avatarUrl = req.file.path;  // 儲存檔案的相對路徑
    }

    // 更新資料庫中的 avatar_url
    const [result] = await pool.query(
      'UPDATE users SET avatar_url = ? WHERE id = ?',
      [avatarUrl, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '使用者不存在' });
    }

    // 確保返回的是完整的 URL
    const fullAvatarUrl = `${req.protocol}://${req.get('host')}/${avatarUrl}`;

    // 返回更新後的用戶資料
    const [updatedUser] = await pool.query(
      'SELECT id, avatar_url FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      message: '大頭貼更新成功',
      avatar_url: fullAvatarUrl,  // 返回完整的 URL
    });
  } catch (error) {
    console.error('更新資料錯誤:', error);
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

export default router