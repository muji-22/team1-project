// routes/shipment.js
import express from 'express'
const router = express.Router()

// 存取`.env`設定檔案使用
import 'dotenv/config.js'

const callback_url = process.env.SHIP_711_STORE_CALLBACK_URL

// 7-11門市選擇的回調路由
router.post('/711', function (req, res, next) {
  //console.log(req.body)  // 可以用來看收到的門市資料
  res.redirect(callback_url + '?' + new URLSearchParams(req.body).toString())
})

export default router