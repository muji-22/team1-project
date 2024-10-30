import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import testRouter from './routes/test.js'  // 引入測試路由
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// 使用測試路由
app.use('/api/test', testRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`)
})