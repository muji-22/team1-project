// routes/orders.js
import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'
import { sendOrderConfirmationEmail } from '../services/emailService.js'

const router = express.Router()

// 前面的程式碼保持不變...

// 修改取得單一訂單詳情
router.get('/:id', authenticateToken, async (req, res) => {
  let conn
  try {
    const orderId = req.params.id
    const userId = req.user.id

    conn = await pool.getConnection()

    // 獲取訂單主檔資料
    const [orders] = await conn.query(
      `SELECT o.*, 
              c.code as coupon_code, 
              c.discount as coupon_discount,
              c.type as coupon_type,
              u.email as user_email,
              u.name as user_name
       FROM orders o
       LEFT JOIN coupons c ON o.coupon_id = c.id
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ? AND o.user_id = ?`,
      [orderId, userId]
    )

    if (orders.length === 0) {
      return res.status(404).json({
        message: '找不到此訂單'
      })
    }

    // 獲取訂單項目資料
    const [items] = await conn.query(
      `SELECT oi.*, 
              COALESCE(p.name, r.name) as name,
              COALESCE(p.image, r.image) as image,
              CASE 
                WHEN oi.type = 'rental' THEN r.rental_fee
                ELSE p.price 
              END as unit_price
       FROM order_items oi
       LEFT JOIN product p ON oi.product_id = p.id AND oi.type = 'sale'
       LEFT JOIN rent r ON oi.product_id = r.id AND oi.type = 'rental'
       WHERE oi.order_id = ?
       ORDER BY oi.id`,
      [orderId]
    )

    // 整理訂單資料格式
    const orderData = {
      id: orders[0].id,
      created_at: orders[0].created_at,
      recipient_name: orders[0].recipient_name,
      recipient_phone: orders[0].recipient_phone,
      recipient_address: orders[0].recipient_address,
      payment_method: orders[0].payment_method,
      payment_status: orders[0].payment_status,
      order_status: orders[0].order_status,
      total_amount: orders[0].total_amount,
      discount_amount: orders[0].discount_amount,
      final_amount: orders[0].final_amount,
      payment_info: orders[0].payment_info,
      coupon: orders[0].coupon_code ? {
        code: orders[0].coupon_code,
        discount: orders[0].coupon_discount,
        type: orders[0].coupon_type
      } : null,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        quantity: item.quantity,
        price: item.unit_price,
        rental_days: item.rental_days,
        deposit: item.deposit,
        image: item.image,
        subtotal: item.type === 'rental' 
          ? (item.rental_days * item.unit_price * item.quantity) + (item.deposit * item.quantity)
          : item.unit_price * item.quantity
      }))
    }

    res.json(orderData)

  } catch (error) {
    console.error('獲取訂單詳情失敗:', error)
    res.status(500).json({
      message: '獲取訂單詳情失敗'
    })
  } finally {
    if (conn) {
      conn.release()
    }
  }
})

export default router