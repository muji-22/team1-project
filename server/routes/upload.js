// routes/upload.js
import express from 'express'
import multer from 'multer'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { authenticateToken } from '../middlewares/auth.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 確保上傳目錄存在
const uploadDir = path.join(__dirname, '../public/uploads/forum')
fs.ensureDirSync(uploadDir)

// 設定 multer
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // 檢查檔案類型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('不支援的檔案格式')
      error.code = 'UNSUPPORTED_MEDIA_TYPE'
      return cb(error, false)
    }
    cb(null, true)
  }
})

// 錯誤處理中間件
const handleError = (err, req, res, next) => {
  console.error('上傳錯誤:', err)
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'error',
      message: '檔案大小不能超過 5MB'
    })
  }
  
  if (err.code === 'UNSUPPORTED_MEDIA_TYPE') {
    return res.status(400).json({
      status: 'error',
      message: '不支援的檔案格式'
    })
  }

  res.status(500).json({
    status: 'error',
    message: '圖片上傳失敗'
  })
}

// 圖片上傳 API
router.post('/forum-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: '請選擇要上傳的圖片'
      })
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const filename = `forum-${uniqueSuffix}.jpg`
    const filepath = path.join(uploadDir, filename)

    // 使用 sharp 處理圖片
    await sharp(req.file.buffer)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'centre'
      })
      .jpeg({
        quality: 80,
        progressive: true
      })
      .toFile(filepath)

    res.json({
      status: 'success',
      data: {
        filename: filename,
        url: `/uploads/forum/${filename}`
      }
    })
  } catch (error) {
    console.error('圖片處理失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '圖片處理失敗'
    })
  }
})

// 註冊錯誤處理中間件
router.use(handleError)

export default router