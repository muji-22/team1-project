// routes/ecpay.js
import express from 'express'
import { authenticateToken } from '../middlewares/auth.js'
import pool from '../config/db.js'
import 'dotenv/config'
import crypto from 'crypto'

const router = express.Router()

// 綠界API設定
const {
  ECPAY_MERCHANT_ID,
  ECPAY_HASH_KEY,
  ECPAY_HASH_IV,
  ECPAY_RETURN_URL,
  ECPAY_ORDER_RESULT_URL,
  ECPAY_ORDER_CALLBACK_URL
} = process.env

// 測試環境API網址
const ECPAY_API_URL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'

// 產生檢查碼
const generateCheckMacValue = (data) => {
  let rawString = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('&')

  rawString = `HashKey=${ECPAY_HASH_KEY}&${rawString}&HashIV=${ECPAY_HASH_IV}`
  rawString = encodeURIComponent(rawString).toLowerCase()
  
  rawString = rawString
    .replace(/%20/g, '+')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')

  return crypto.createHash('sha256')
    .update(rawString)
    .digest('hex')
    .toUpperCase()
}

// 建立綠界支付表單
router.post('/create-payment/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params

    // 取得訂單資訊
    const [orders] = await pool.query(
      `SELECT o.*, GROUP_CONCAT(
        CASE 
          WHEN oi.type = 'rental' 
          THEN CONCAT(p.name, ' x', oi.quantity, ' (租借 ', oi.rental_days, '天)')
          ELSE CONCAT(p.name, ' x', oi.quantity)
        END
        SEPARATOR '#') as items_description
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN product p ON oi.product_id = p.id
       WHERE o.id = ? AND o.user_id = ?
       GROUP BY o.id`,
      [orderId, req.user.id]
    )

    if (orders.length === 0) {
      return res.status(404).json({ message: '訂單不存在' })
    }

    const order = orders[0]

    // 格式化時間
    const now = new Date()
    const formattedDate = `${now.getFullYear()}/${
      String(now.getMonth() + 1).padStart(2, '0')}/${
      String(now.getDate()).padStart(2, '0')} ${
      String(now.getHours()).padStart(2, '0')}:${
      String(now.getMinutes()).padStart(2, '0')}:${
      String(now.getSeconds()).padStart(2, '0')}`

    // 建立綠界訂單資料
    // 參考https://developers.ecpay.com.tw/?p=2864
    const ecpayData = {
      MerchantID: ECPAY_MERCHANT_ID,
      MerchantTradeNo: `${order.id}${Date.now().toString().slice(-6)}`,
      MerchantTradeDate: formattedDate,
      PaymentType: 'aio',
      TotalAmount: order.final_amount,
      TradeDesc: encodeURIComponent('遊戲商城購物'),
      ItemName: order.items_description,
      ReturnURL: ECPAY_RETURN_URL,
      OrderResultURL: `${ECPAY_ORDER_RESULT_URL}?orderId=${orderId}`,
      ClientBackURL: ECPAY_ORDER_RESULT_URL,
      ChoosePayment: 'ALL',
      EncryptType: 1
    }

    // 產生檢查碼
    ecpayData.CheckMacValue = generateCheckMacValue(ecpayData)

    // 回傳表單資料
    res.json({
      paymentUrl: ECPAY_API_URL,
      ecpayData
    })

  } catch (error) {
    console.error('建立金流訂單錯誤:', error)
    res.status(500).json({ message: '系統錯誤' })
  }
})

// 處理綠界支付回調
router.post('/callback', async (req, res) => {
  try {
    const data = req.body
    console.log('綠界回調資料:', data)
    
    // 驗證檢查碼
    const checkMacValue = data.CheckMacValue
    delete data.CheckMacValue
    
    const generatedCheckMacValue = generateCheckMacValue(data)
    console.log('產生的檢查碼:', generatedCheckMacValue)
    console.log('收到的檢查碼:', checkMacValue)

    if (generatedCheckMacValue !== checkMacValue) {
      console.log('檢查碼驗證失敗')
      return res.status(400).send('0|CheckMacValue verify fail')
    }

    // 解析訂單編號 (移除後6位時間戳記)
    const orderId = data.MerchantTradeNo.slice(0, -6)
    console.log('訂單編號:', orderId)

    if (data.RtnCode === '1') {
      console.log('更新訂單狀態為已付款')
      // 更新訂單狀態
      await pool.query(
        `UPDATE orders 
         SET payment_status = 1, 
             order_status = 2,
             updated_at = NOW() 
         WHERE id = ?`,
        [orderId]
      )
      console.log('訂單狀態更新完成')
    }

    // 回傳 1|OK 給綠界
    console.log('回傳成功訊息給綠界')
    res.send('1|OK')

  } catch (error) {
    console.error('處理金流回調錯誤:', error)
    res.status(500).send('0|Error')
  }
})


export default router