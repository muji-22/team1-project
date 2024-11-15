import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'
import * as crypto from 'crypto'

const router = express.Router()
const {
  ECPAY_MERCHANT_ID,
  ECPAY_HASH_KEY,
  ECPAY_HASH_IV,
  ECPAY_TEST,
  ECPAY_RETURN_URL,
  ECPAY_ORDER_RESULT_URL,
  ECPAY_ORDER_CALLBACK_URL
} = process.env

// 建立付款請求
router.get('/payment/:orderId', authenticateToken, async (req, res) => {
  const orderId = req.params.orderId
  
  try {
    const [order] = await pool.query(
      `SELECT * FROM orders WHERE id = ? AND user_id = ? AND payment_status = 0`,
      [orderId, req.user.id]
    )

    if (order.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此訂單或訂單已付款'
      })
    }

    const orderData = order[0]
    const stage = ECPAY_TEST === 'true' ? '-stage' : ''
    const APIURL = `https://payment${stage}.ecpay.com.tw/Cashier/AioCheckOut/V5`

    // 準備綠界需要的參數
    const MerchantTradeNo = `${orderData.id}${Date.now()}`
    const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })

    // 基本參數
    const base = {
      MerchantID: ECPAY_MERCHANT_ID,
      MerchantTradeNo,
      MerchantTradeDate,
      PaymentType: 'aio',
      TotalAmount: orderData.final_amount,
      TradeDesc: '桌遊商城購物',
      ItemName: `訂單編號${orderData.id}`,
      ReturnURL: ECPAY_RETURN_URL,
      OrderResultURL: ECPAY_ORDER_RESULT_URL,
      ChoosePayment: orderData.payment_method === 'credit_card' ? 'Credit' : 'ATM',
      EncryptType: 1
    }

    // 產生 CheckMacValue
    const CheckMacValue = generateCheckMacValue(base)

    // 產生自動提交的表單
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body>
        <form id="pay-form" action="${APIURL}" method="post">
          ${Object.entries({...base, CheckMacValue}).map(([key, value]) => 
            `<input type="hidden" name="${key}" value="${value}">`
          ).join('')}
        </form>
        <script>document.getElementById("pay-form").submit()</script>
      </body>
      </html>
    `

    res.send(html)

  } catch (error) {
    console.error('建立付款錯誤:', error)
    res.status(500).json({
      status: 'error', 
      message: '建立付款請求失敗'
    })
  }
})

// 處理付款結果通知
router.post('/callback', express.raw({type: 'application/x-www-form-urlencoded'}), async (req, res) => {
  try {
    const data = req.body
    console.log('綠界回傳:', data)

    // 檢查付款結果
    if(data.RtnCode === '1') {
      // 更新訂單狀態
      await pool.query(
        `UPDATE orders SET payment_status = 1, order_status = 2 WHERE id = ?`,
        [data.MerchantTradeNo.split('T')[0]]
      )
    }

    res.send('1|OK')

  } catch (error) {
    console.error('處理付款結果錯誤:', error)
    res.send('0|Error')
  }
})

// 處理付款完成導回
router.post('/result', (req, res) => {
  res.redirect(
    ECPAY_ORDER_CALLBACK_URL + 
    '?' + 
    new URLSearchParams(req.body).toString()
  )
})

// 產生檢查碼
function generateCheckMacValue(params) {
  const paramsStr = Object.entries(params)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  const checkStr = `HashKey=${ECPAY_HASH_KEY}&${paramsStr}&HashIV=${ECPAY_HASH_IV}`
  const encodedStr = encodeURIComponent(checkStr)
    .toLowerCase()
    .replace(/%20/g, '+')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')

  return crypto.createHash('sha256')
    .update(encodedStr)
    .digest('hex')
    .toUpperCase()
}

export default router