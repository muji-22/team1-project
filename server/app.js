import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
// ... 其他 import

const app = express()

// 1. 最基本的中間件
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost:9000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))

// 2. 視圖引擎設定
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// 3. 基本中間件
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 4. 加入安全性中間件 (加在這裡)
// 基本安全性標頭
app.use(helmet())

// API 請求限制
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分鐘
    max: 100, // 限制每個 IP 15分鐘內最多 100 個請求
    message: {
        status: 'error',
        message: '請求次數過多，請稍後再試'
    }
})
app.use('/api/', limiter)

// 5. session 相關設定
const fileStoreOptions = { logFn: function () {} }
app.use(
  session({
    store: new FileStore(fileStoreOptions),
    name: 'SESSION_ID',
    secret: '67f71af4602195de2450faeb6f8856c0',
    cookie: {
      maxAge: 30 * 86400000,
    },
    resave: false,
    saveUninitialized: false,
  })
)

// 6. 路由設定
const apiPath = '/api'
const routePath = path.join(__dirname, 'routes')
// ... 路由載入的程式碼

// 7. 錯誤處理
app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  // ... 錯誤處理程式碼
})