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
const errorHandler = (err, req, res, next) => {
  console.error('上傳錯誤:', err)
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'error',
      message: '檔案大小超過限制'
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
    message: err.message || '圖片上傳失敗'
  })
}

// 圖片上傳 API
router.post('/forum-image', authenticateToken, upload.single('image'), async (req, res, next) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ 
        status: 'error', 
        message: '請選擇要上傳的圖片' 
      })
    }

    // 確保目錄存在
    await fs.ensureDir(uploadDir)

    // 生成唯一檔名
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const ext = path.extname(file.originalname).toLowerCase()
    const filename = `forum-${uniqueSuffix}${ext}`

    // 使用 sharp 處理圖片
    const image = sharp(file.buffer)
    const metadata = await image.metadata()

    // 如果圖片太大，進行壓縮
    if (metadata.width > 1920) {
      image.resize(1920, null, {
        withoutEnlargement: true
      })
    }

    // 根據不同格式進行最佳化
    switch (metadata.format) {
      case 'jpeg':
        image.jpeg({ quality: 80 })
        break
      case 'png':
        image.png({ compressionLevel: 9 })
        break
      case 'webp':
        image.webp({ quality: 80 })
        break
      // gif 保持原樣
    }

    // 儲存圖片
    const filepath = path.join(uploadDir, filename)
    await image.toFile(filepath)

    // 回傳圖片網址 (使用絕對路徑)
    res.json({
      status: 'success',
      data: {
        url: `/uploads/forum/${filename}`
      }
    })

  } catch (error) {
    next(error)
  }
})

// 註冊錯誤處理中間件
router.use(errorHandler)

export default router