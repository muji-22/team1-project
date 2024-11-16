// services/ecpayService.js
import crypto from 'crypto'
import axios from 'axios'
import 'dotenv/config'
import pool from '../config/db.js'

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
  // 按照綠界規定的格式產生檢查碼
  let rawString = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('&')

  rawString = `HashKey=${ECPAY_HASH_KEY}&${rawString}&HashIV=${ECPAY_HASH_IV}`
  rawString = encodeURIComponent(rawString).toLowerCase()
  
  // 移除特定字元
  rawString = rawString
    .replace(/%20/g, '+')
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')

  // 使用 SHA256 產生檢查碼
  return crypto.createHash('sha256')
    .update(rawString)
    .digest('hex')
    .toUpperCase()
}

// 建立綠界訂單
export const createEcpayOrder = async (order) => {
  try {
    // 建立訂單資料
    const ecpayData = {
      MerchantID: ECPAY_MERCHANT_ID,
      MerchantTradeNo: `${Date.now()}${Math.floor(Math.random() * 1000)}`, // 產生唯一訂單編號
      MerchantTradeDate: new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/[/:]/g, '/'),
      PaymentType: 'aio',
      TotalAmount: order.final_amount,
      TradeDesc: '遊戲商城購物',
      ItemName: order.items.map(item => `${item.name} x ${item.quantity}`).join('#'),
      ReturnURL: ECPAY_RETURN_URL,
      OrderResultURL: ECPAY_ORDER_RESULT_URL,
      ClientBackURL: ECPAY_ORDER_CALLBACK_URL,
      ChoosePayment: 'Credit',
      EncryptType: 1,
      // 測試環境信用卡號
      CustomField1: '4311-9522-2222-2222',
      CustomField2: '222',
      CustomField3: '12/25'
    }

    // 產生檢查碼
    ecpayData.CheckMacValue = generateCheckMacValue(ecpayData)

    // 更新資料庫中的訂單資訊
    await pool.query(
      'UPDATE orders SET ecpay_merchant_trade_no = ?, payment_status = 0 WHERE id = ?',
      [ecpayData.MerchantTradeNo, order.id]
    )

    return ecpayData

  } catch (error) {
    console.error('建立綠界訂單錯誤:', error)
    throw error
  }
}

// 驗證綠界回傳資料
export const verifyEcpayCallback = (data) => {
  const checkMacValue = data.CheckMacValue
  delete data.CheckMacValue
  return generateCheckMacValue(data) === checkMacValue
}

// 處理付款完成
export const handlePaymentComplete = async (merchantTradeNo) => {
  try {
    // 更新訂單狀態
    const [result] = await pool.query(
      `UPDATE orders 
       SET payment_status = 1, 
           order_status = 2,
           updated_at = NOW()
       WHERE ecpay_merchant_trade_no = ?`,
      [merchantTradeNo]
    )

    return result.affectedRows > 0

  } catch (error) {
    console.error('更新訂單狀態錯誤:', error)
    throw error
  }
}

export default {
  createEcpayOrder,
  verifyEcpayCallback,
  handlePaymentComplete
}