import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'

const router = express.Router()

// 所有購物車操作都需要先驗證登入狀態
router.use(authenticateToken)

// 取得購物車內容
router.get('/', async (req, res) => {
  const userId = req.user.id  // 改用 JWT 中的 user id

  try {
    // 1. 先查詢或建立使用者的購物車
    let [carts] = await pool.execute(
      'SELECT * FROM cart WHERE user_id = ? AND status = 1',
      [userId]
    )

    // 如果沒有進行中的購物車，建立一個新的
    if (carts.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO cart (user_id) VALUES (?)',
        [userId]
      )
      const cartId = result.insertId
      carts = [{ id: cartId }]
    }

    // 2. 取得購物車內的所有項目及商品資訊
    // (資料庫"cart_items"簡寫成 "ci")
    // (資料庫"product"簡寫成 "p")
    const [items] = await pool.execute(`
      SELECT 
        ci.*,
        p.name,
        p.price,
        p.image
      FROM cart_items ci
      JOIN product p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [carts[0].id])

    return res.json({
      status: 'success',
      data: {
        cart: carts[0],
        items: items
      }
    })
  } catch (error) {
    console.error('取得購物車錯誤:', error)
    return res.status(500).json({
      status: 'error',
      message: '取得購物車時發生錯誤'
    })
  }
})

// 新增商品至購物車
router.post('/items', async (req, res) => {
  const userId = req.user.id  // 改用 JWT 中的 user id
  const { productId, quantity } = req.body

  try {
    // 1. 取得或建立購物車
    let [carts] = await pool.execute(
      'SELECT * FROM cart WHERE user_id = ? AND status = 1',
      [userId]
    )

    let cartId
    if (carts.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO cart (user_id) VALUES (?)',
        [userId]
      )
      cartId = result.insertId
    } else {
      cartId = carts[0].id
    }

    // 2. 檢查商品是否已在購物車中
    const [existingItems] = await pool.execute(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    )

    if (existingItems.length > 0) {
      // 如果已存在，更新數量
      await pool.execute(
        `UPDATE cart_items 
         SET quantity = quantity + ?
         WHERE id = ?`,
        [quantity, existingItems[0].id]
      )
    } else {
      // 如果不存在，新增項目
      await pool.execute(
        `INSERT INTO cart_items 
         (cart_id, product_id, quantity)
         VALUES (?, ?, ?)`,
        [cartId, productId, quantity]
      )
    }

    return res.json({
      status: 'success',
      message: '成功加入購物車'
    })
  } catch (error) {
    console.error('加入購物車錯誤:', error)
    return res.status(500).json({
      status: 'error',
      message: '加入購物車時發生錯誤'
    })
  }
})

// 更新購物車商品數量
router.put('/items/:itemId', async (req, res) => {
  const userId = req.user.id  // 改用 JWT 中的 user id
  const { itemId } = req.params
  const { quantity } = req.body

  try {
    // 1. 確認這個項目是否屬於該使用者的購物車
    const [items] = await pool.execute(`
      SELECT ci.* 
      FROM cart_items ci
      JOIN cart c ON ci.cart_id = c.id
      WHERE ci.id = ? AND c.user_id = ? AND c.status = 1
    `, [itemId, userId])

    if (items.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到該購物車項目'
      })
    }

    // 2. 更新購物車項目
    await pool.execute(`
      UPDATE cart_items 
      SET quantity = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [quantity, itemId])

    return res.json({
      status: 'success',
      message: '成功更新購物車'
    })
  } catch (error) {
    console.error('更新購物車錯誤:', error)
    return res.status(500).json({
      status: 'error',
      message: '更新購物車時發生錯誤'
    })
  }
})

// 刪除購物車商品
router.delete('/items/:itemId', async (req, res) => {
  const userId = req.user.id  // 改用 JWT 中的 user id
  const { itemId } = req.params

  try {
    // 1. 確認這個項目是否屬於該使用者的購物車
    const [items] = await pool.execute(`
      SELECT ci.* 
      FROM cart_items ci
      JOIN cart c ON ci.cart_id = c.id
      WHERE ci.id = ? AND c.user_id = ? AND c.status = 1
    `, [itemId, userId])

    if (items.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到該購物車項目'
      })
    }

    // 2. 刪除購物車項目
    await pool.execute(
      'DELETE FROM cart_items WHERE id = ?',
      [itemId]
    )

    return res.json({
      status: 'success',
      message: '成功刪除商品'
    })
  } catch (error) {
    console.error('刪除購物車項目錯誤:', error)
    return res.status(500).json({
      status: 'error',
      message: '刪除購物車項目時發生錯誤'
    })
  }
})

// 清空購物車
router.delete('/clear', async (req, res) => {
  const userId = req.user.id  // 改用 JWT 中的 user id

  try {
    // 1. 取得使用者的購物車 ID
    const [carts] = await pool.execute(
      'SELECT id FROM cart WHERE user_id = ? AND status = 1',
      [userId]
    )

    if (carts.length > 0) {
      // 2. 刪除該購物車內的所有項目
      await pool.execute(
        'DELETE FROM cart_items WHERE cart_id = ?',
        [carts[0].id]
      )
    }

    return res.json({
      status: 'success',
      message: '購物車已清空'
    })
  } catch (error) {
    console.error('清空購物車錯誤:', error)
    return res.status(500).json({
      status: 'error',
      message: '清空購物車時發生錯誤'
    })
  }
})

export default router