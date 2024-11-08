import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import productRouter from './routes/products.js'
import authRouter from './routes/auth.js'
import couponRouter from './routes/coupons.js'
import productImagesRouter from './routes/productImages.js'
import cartRoutes from './routes/cart.js'
import favoritesRouter from './routes/favorites.js'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// CORS 設定
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// API 路由
app.use('/api/products', productRouter)
<<<<<<< HEAD
//app.use('/api/auth', authRouter)  // 新增授權相關路由
=======
app.use('/api/auth', authRouter)
app.use('/api/coupons', couponRouter)
app.use('/api/product-images', productImagesRouter)
app.use('/api/cart', cartRoutes)
app.use('/api/favorites', favoritesRouter)
>>>>>>> 18e1594c94bdac46f3fb09413ffdaf59f0cab79c

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    status: 'error',
    message: '伺服器錯誤' 
  })
})

export default app