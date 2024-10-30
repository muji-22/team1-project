import express from 'express'
import { authenticate } from '../middlewares/authenticate.js'
const router = express.Router()

// 註冊
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    // 檢查必要欄位
    if (!username || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: '所有欄位都是必填的'
      })
    }

    // TODO: 資料庫操作
    
    res.json({
      status: 'success',
      message: '註冊成功'
    })
  } catch (error) {
    next(error)
  }
})

// 登入
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    // 檢查必要欄位
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: '所有欄位都是必填的'
      })
    }

    // TODO: 資料庫驗證

    // 設定 session
    req.session.userId = 1 // 之後改成實際的 user id
    req.session.userName = 'test' // 之後改成實際的 username

    res.json({
      status: 'success',
      message: '登入成功'
    })
  } catch (error) {
    next(error)
  }
})

// 登出
router.post('/logout', (req, res) => {
  req.session.destroy()
  res.clearCookie('SESSION_ID')
  res.json({
    status: 'success',
    message: '登出成功'
  })
})

// 檢查登入狀態
router.get('/check', authenticate, (req, res) => {
  res.json({
    status: 'success',
    data: {
      isLogin: true,
      user: req.session.user
    }
  })
})

export default router