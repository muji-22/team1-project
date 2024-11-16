// routes/orders.js
import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'
import { sendOrderConfirmationEmail } from '../services/emailService.js'

const router = express.Router()

// 價格驗證函數
const validatePrices = async (
  conn,
  items,
  final_amount,
  discount_amount = 0
) => {
  let calculatedTotal = 0

  for (const item of items) {
    const [product] = await conn.query(
      `SELECT ${item.type === 'sale' ? 'price, valid' : 'rental_fee, deposit, valid'} 
       FROM ${item.type === 'sale' ? 'product' : 'rent'} 
       WHERE id = ?`,
      [item.product_id]
    )

    if (!product.length || !product[0].valid) {
      throw new Error(`商品 ${item.product_id} 不存在或已下架`)
    }

    if (item.type === 'sale') {
      calculatedTotal += product[0].price * item.quantity
    } else {
      calculatedTotal +=
        product[0].rental_fee * (item.rental_days || 3) * item.quantity +
        product[0].deposit * item.quantity
    }
  }

  calculatedTotal -= discount_amount

  // 允許 1 元誤差
  if (Math.abs(calculatedTotal - final_amount) > 1) {
    throw new Error('訂單金額驗證失敗，請重新整理購物車')
  }
}

// 優惠券驗證函數
const validateCoupon = async (conn, userId, couponId, orderTotal) => {
  if (!couponId) return true

  const [coupon] = await conn.query(
    `SELECT uc.*, c.* 
     FROM user_coupons uc
     JOIN coupons c ON uc.coupon_id = c.id
     WHERE uc.user_id = ? AND uc.coupon_id = ? 
     AND uc.used_time IS NULL 
     AND c.end_date >= CURDATE()
     AND c.valid = 1`,
    [userId, couponId]
  )

  if (coupon.length === 0) {
    throw new Error('優惠券無效或已使用')
  }

  return coupon[0]
}

// 取得使用者的訂單列表
router.get('/', authenticateToken, async (req, res) => {
  let conn
  try {
    conn = await pool.getConnection()

    // 取得使用者所有訂單
    const [orders] = await conn.query(
      `SELECT id, created_at, recipient_name, 
              total_amount, discount_amount, final_amount,
              payment_status, order_status
       FROM orders 
       WHERE user_id = ?
       ORDER BY created_at DESC`, // 依建立時間降序排列
      [req.user.id]
    )

    // 取得每個訂單的商品資訊
    for (let order of orders) {
      const [items] = await conn.query(
        `SELECT oi.*, 
                CASE 
                  WHEN oi.type = 'rental' THEN r.name
                  ELSE p.name 
                END as product_name,
                CASE 
                  WHEN oi.type = 'rental' THEN r.image
                  ELSE p.image 
                END as product_image
         FROM order_items oi
         LEFT JOIN product p ON oi.product_id = p.id AND oi.type = 'sale'
         LEFT JOIN rent r ON oi.product_id = r.id AND oi.type = 'rental'
         WHERE oi.order_id = ?`,
        [order.id]
      )

      // 加入商品資訊到訂單物件
      order.items = items.map((item) => ({
        ...item,
        name: item.product_name,
        image: item.product_image,
      }))
    }

    res.json(orders)
  } catch (error) {
    console.error('取得訂單列表錯誤:', error)
    res.status(500).json({
      message: '系統錯誤，無法取得訂單列表',
    })
  } finally {
    if (conn) {
      conn.release()
    }
  }
})

// 建立訂單
router.post('/', authenticateToken, async (req, res) => {
  let conn
  try {
    const {
      recipient_name,
      recipient_phone,
      recipient_address,
      total_amount,
      discount_amount = 0,
      final_amount,
      coupon_id,
      payment_method,
      items,
    } = req.body

    // 基本驗證
    if (!recipient_name || !recipient_phone || !recipient_address) {
      return res.status(400).json({
        status: 'error',
        message: '請提供完整的收件資訊',
      })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: '請選購商品',
      })
    }

    if (
      !payment_method ||
      !['credit_card', 'transfer'].includes(payment_method)
    ) {
      return res.status(400).json({
        status: 'error',
        message: '請選擇有效的付款方式',
      })
    }

    conn = await pool.getConnection()
    await conn.beginTransaction()

    const userId = req.user.id

    // 驗證商品價格
    await validatePrices(conn, items, final_amount, discount_amount)

    // 驗證優惠券
    if (coupon_id) {
      await validateCoupon(conn, userId, coupon_id, total_amount)
    }

    // 創建訂單主檔
    const [orderResult] = await conn.query(
      `INSERT INTO orders (
        user_id, recipient_name, recipient_phone, recipient_address,
        total_amount, discount_amount, final_amount, 
        coupon_id, payment_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        recipient_name,
        recipient_phone,
        recipient_address,
        total_amount,
        discount_amount,
        final_amount,
        coupon_id,
        payment_method,
      ]
    )

    const orderId = orderResult.insertId

    // 創建訂單項目並保存項目資訊
    const orderItems = []
    for (const item of items) {
      let [productInfo] = await conn.query(
        `SELECT name, image FROM ${item.type === 'sale' ? 'product' : 'rent'} WHERE id = ?`,
        [item.product_id]
      )

      if (item.type === 'rental') {
        await conn.query(
          `INSERT INTO order_items (
            order_id, product_id, type, quantity,
            price, deposit, rental_days
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.product_id,
            item.type,
            item.quantity,
            item.price,
            item.deposit,
            item.rental_days || 3,
          ]
        )
      } else {
        await conn.query(
          `INSERT INTO order_items (
            order_id, product_id, type, quantity, price
          ) VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.type, item.quantity, item.price]
        )
      }

      orderItems.push({
        ...item,
        name: productInfo.name,
        image: productInfo.image,
      })
    }

    // 更新優惠券使用狀態
    if (coupon_id) {
      await conn.query(
        `UPDATE user_coupons 
         SET used_time = CURRENT_TIMESTAMP 
         WHERE user_id = ? AND coupon_id = ?`,
        [userId, coupon_id]
      )
    }

    // 取得用戶 email
    const [users] = await conn.query('SELECT email FROM users WHERE id = ?', [
      userId,
    ])

    await conn.commit()

    // 發送訂單確認信
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
        created_at: new Date(),
      }

      await sendOrderConfirmationEmail(users[0].email, mailData)
    } catch (emailError) {
      console.error('發送訂單確認信失敗:', emailError)
      // 繼續執行，不影響訂單建立
    }

    res.status(201).json({
      status: 'success',
      message: '訂單建立成功',
      orderId: orderId,
    })
  } catch (error) {
    if (conn) {
      await conn.rollback()
    }
    console.error('建立訂單失敗:', error)
    res.status(400).json({
      status: 'error',
      message: error.message || '建立訂單失敗',
    })
  } finally {
    if (conn) {
      conn.release()
    }
  }
})

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
        message: '找不到此訂單',
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
      coupon: orders[0].coupon_code
        ? {
            code: orders[0].coupon_code,
            discount: orders[0].coupon_discount,
            type: orders[0].coupon_type,
          }
        : null,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        quantity: item.quantity,
        price: item.unit_price,
        rental_days: item.rental_days,
        deposit: item.deposit,
        image: item.image,
        subtotal:
          item.type === 'rental'
            ? item.rental_days * item.unit_price * item.quantity +
              item.deposit * item.quantity
            : item.unit_price * item.quantity,
      })),
    }

    res.json(orderData)
  } catch (error) {
    console.error('獲取訂單詳情失敗:', error)
    res.status(500).json({
      message: '獲取訂單詳情失敗',
    })
  } finally {
    if (conn) {
      conn.release()
    }
  }
})

export default router
