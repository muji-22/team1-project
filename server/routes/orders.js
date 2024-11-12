// routes/orders.js
import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'
import { sendOrderConfirmationEmail } from '../services/emailService.js'

const router = express.Router()

// 建立訂單
router.post('/', authenticateToken, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    const userId = req.user.id
    const { 
      recipient_name, 
      recipient_phone, 
      recipient_address,
      total_amount,
      discount_amount,
      final_amount,
      coupon_id,
      payment_method,
      items 
    } = req.body

    // 1. 創建訂單主檔
    const [orderResult] = await conn.query(
      `INSERT INTO orders (
        user_id, recipient_name, recipient_phone, recipient_address,
        total_amount, discount_amount, final_amount, 
        coupon_id, payment_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, recipient_name, recipient_phone, recipient_address,
        total_amount, discount_amount, final_amount,
        coupon_id, payment_method
      ]
    )

    const orderId = orderResult.insertId

    // 2. 創建訂單項目並保存項目資訊
    const orderItems = []
    for (const item of items) {
      let [productInfo] = await conn.query(
        `SELECT name, image FROM ${item.type === 'sale' ? 'product' : 'rent'} WHERE id = ?`,
        [item.product_id]
      )

      if (item.type === 'rental') {
        // 租借商品
        await conn.query(
          `INSERT INTO order_items (
            order_id, product_id, type, quantity,
            price, deposit, rental_days
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId, item.product_id, item.type, item.quantity,
            item.price, item.deposit, item.rental_days
          ]
        )
      } else {
        // 一般商品
        await conn.query(
          `INSERT INTO order_items (
            order_id, product_id, type, quantity, price
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            orderId, item.product_id, item.type, item.quantity, item.price
          ]
        )
      }

      // 保存完整的項目資訊供郵件使用
      orderItems.push({
        ...item,
        name: productInfo.name,
        image: productInfo.image
      })
    }

    // 3. 如果有使用優惠券，更新優惠券使用狀態
    if (coupon_id) {
      await conn.query(
        `UPDATE user_coupons 
         SET used_time = CURRENT_TIMESTAMP 
         WHERE user_id = ? AND coupon_id = ?`,
        [userId, coupon_id]
      )
    }

    // 4. 取得用戶 email
    const [users] = await conn.query(
      'SELECT email FROM users WHERE id = ?',
      [userId]
    )

    await conn.commit()

    // 5. 發送訂單確認信
    try {
      const mailData = {
        id: orderId,
        recipient_name,
        recipient_phone,
        recipient_address,
        total_amount,
        discount_amount,
        final_amount,
        payment_method,
        items: orderItems,
        created_at: new Date()
      }

      await sendOrderConfirmationEmail(users[0].email, mailData)
    } catch (emailError) {
      console.error('發送訂單確認信失敗:', emailError)
      // 繼續執行，不影響訂單建立
    }

    res.json({
      status: 'success',
      message: '訂單建立成功',
      orderId: orderId
    })

  } catch (error) {
    await conn.rollback()
    console.error('建立訂單失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '建立訂單失敗'
    })
  } finally {
    conn.release()
  }
})

// 取得單一訂單詳情
router.get('/:id', authenticateToken, async (req, res) => {
    const conn = await pool.getConnection()
    try {
      const orderId = req.params.id
      const userId = req.user.id
  
      // 1. 獲取訂單主檔資料
      const [orders] = await conn.query(
        `SELECT o.*, 
                c.code as coupon_code, 
                c.discount as coupon_discount,
                c.type as coupon_type
         FROM orders o
         LEFT JOIN coupons c ON o.coupon_id = c.id
         WHERE o.id = ? AND o.user_id = ?`,
        [orderId, userId]
      )
  
      if (orders.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: '找不到此訂單'
        })
      }
  
      const order = orders[0]
  
      // 2. 獲取訂單項目資料
      const [items] = await conn.query(
        `SELECT oi.*, 
                COALESCE(p.name, r.name) as name,
                COALESCE(p.image, r.image) as image
         FROM order_items oi
         LEFT JOIN product p ON oi.product_id = p.id AND oi.type = 'sale'
         LEFT JOIN rent r ON oi.product_id = r.id AND oi.type = 'rental'
         WHERE oi.order_id = ?`,
        [orderId]
      )
  
      // 3. 整合資料並回傳
      res.json({
        status: 'success',
        data: {
          ...order,
          items: items
        }
      })
  
    } catch (error) {
      console.error('獲取訂單詳情失敗:', error)
      res.status(500).json({
        status: 'error',
        message: '獲取訂單詳情失敗'
      })
    } finally {
      conn.release()
    }
  })

export default router