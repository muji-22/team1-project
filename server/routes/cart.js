// routes/cart.js
import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'

const router = express.Router()

// 所有購物車操作都需要先驗證登入狀態
router.use(authenticateToken)

// 取得購物車內容
router.get('/', async (req, res) => {
  const userId = req.user.id
  console.log('正在獲取購物車，用戶ID:', userId);

  try {
    // 1. 先查詢或建立使用者的購物車
    console.log('開始查詢購物車');
    let [carts] = await pool.execute(
      'SELECT * FROM cart WHERE user_id = ? AND status = 1',
      [userId]
    )
    console.log('查詢到的購物車:', carts);

    let cartId;
    if (carts.length === 0) {
      console.log('沒有找到購物車，創建新的');
      const [result] = await pool.execute(
        'INSERT INTO cart (user_id) VALUES (?)',
        [userId]
      )
      cartId = result.insertId;
      console.log('新創建的購物車ID:', cartId);
    } else {
      cartId = carts[0].id;
      console.log('使用現有購物車ID:', cartId);
    }

    // 2. 檢查購物車ID是否有效
    if (!cartId) {
      throw new Error('無效的購物車ID');
    }

    // 3. 取得購物車內的所有項目及商品資訊
    console.log('開始查詢購物車項目');
    const [items] = await pool.execute(
      `SELECT 
        ci.*,
        COALESCE(p.name, r.name) as name,
        COALESCE(p.price, r.rental_fee) as price,
        COALESCE(p.image, r.image) as image,
        r.deposit,
        r.rental_fee,
        ci.type,
        ci.rental_days,
        ci.quantity
      FROM cart_items ci
      LEFT JOIN product p ON ci.product_id = p.id AND ci.type = 'sale'
      LEFT JOIN rent r ON ci.product_id = r.id AND ci.type = 'rental'
      WHERE ci.cart_id = ?`,
      [cartId]
    )
    console.log('查詢到的購物車項目:', items);

    // 4. 處理數據，確保所有必要的字段都存在
    const processedItems = items.map(item => {
      const processed = {
        id: item.id,
        cart_id: item.cart_id,
        product_id: item.product_id,
        name: item.name || '未知商品',
        type: item.type || 'sale',
        quantity: parseInt(item.quantity) || 1,
        price: parseInt(item.price) || 0,
        image: item.image,
        created_at: item.created_at,
        updated_at: item.updated_at
      };

      if (item.type === 'rental') {
        processed.deposit = parseInt(item.deposit) || 0;
        processed.rental_fee = parseInt(item.rental_fee) || 0;
        processed.rental_days = parseInt(item.rental_days) || 3;
      }

      return processed;
    });

    console.log('處理後的購物車項目:', processedItems);

    // 5. 返回成功響應
    return res.json({
      status: 'success',
      data: {
        cart: {
          id: cartId,
          user_id: userId,
          status: 1
        },
        items: processedItems,
      },
    })

  } catch (error) {
    console.error('取得購物車詳細錯誤:', error)
    return res.status(500).json({
      status: 'error',
      message: '取得購物車時發生錯誤',
      error: error.message
    })
  }
})

// 新增商品至購物車
router.post('/items', async (req, res) => {
  const userId = req.user.id
  const { productId, quantity = 1, type = 'sale', rental_days = 3 } = req.body

  try {
    // 1. 檢查商品是否存在
    let [product] = await pool.execute(
      type === 'sale'
        ? 'SELECT id FROM product WHERE id = ? AND valid = 1'
        : 'SELECT id FROM rent WHERE id = ? AND valid = 1',
      [productId]
    )

    if (product.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '商品不存在'
      })
    }

    // 2. 取得或建立購物車
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

    // 3. 檢查商品是否已在購物車中
    const [existingItems] = await pool.execute(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ? AND type = ?',
      [cartId, productId, type]
    )

    if (existingItems.length > 0) {
      // 如果已存在，更新數量
      await pool.execute(
        `UPDATE cart_items 
         SET quantity = quantity + ?,
             rental_days = ?
         WHERE id = ?`,
        [quantity, rental_days, existingItems[0].id]
      )
    } else {
      // 如果不存在，新增項目
      await pool.execute(
        `INSERT INTO cart_items 
         (cart_id, product_id, quantity, type, rental_days)
         VALUES (?, ?, ?, ?, ?)`,
        [cartId, productId, quantity, type, rental_days]
      )
    }

    return res.json({
      status: 'success',
      message: '成功加入購物車',
    })
  } catch (error) {
    console.error('加入購物車錯誤:', error)
    return res.status(500).json({
      status: 'error',
      message: '加入購物車時發生錯誤',
    })
  }
})

// 更新購物車商品數量
router.put('/items/:itemId', async (req, res) => {
  const userId = req.user.id
  const { itemId } = req.params
  const { quantity, rental_days } = req.body

  try {
    // 1. 確認這個項目是否屬於該使用者的購物車
    const [items] = await pool.execute(
      `SELECT ci.* 
      FROM cart_items ci
      JOIN cart c ON ci.cart_id = c.id
      WHERE ci.id = ? AND c.user_id = ? AND c.status = 1`,
      [itemId, userId]
    )

    if (items.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到該購物車項目',
      })
    }

    // 2. 更新購物車項目
    let sql = `UPDATE cart_items 
               SET quantity = ?,
                   updated_at = CURRENT_TIMESTAMP`
    
    const params = [quantity]
    
    // 如果提供了租借天數，則一併更新
    if (rental_days !== undefined) {
      sql += `, rental_days = ?`
      params.push(rental_days)
    }
    
    sql += ` WHERE id = ?`
    params.push(itemId)

    await pool.execute(sql, params)

    return res.json({
      status: 'success',
      message: '成功更新購物車',
    })
  } catch (error) {
    console.error('更新購物車錯誤:', error)
    return res.status(500).json({
      status: 'error',
      message: '更新購物車時發生錯誤',
    })
  }
})

// 刪除購物車商品
router.delete('/items/:itemId', async (req, res) => {
  const userId = req.user.id
  const { itemId } = req.params

  try {
    // 1. 確認這個項目是否屬於該使用者的購物車
    const [items] = await pool.execute(
      `SELECT ci.* 
      FROM cart_items ci
      JOIN cart c ON ci.cart_id = c.id
      WHERE ci.id = ? AND c.user_id = ? AND c.status = 1`,
      [itemId, userId]
    )

    if (items.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到該購物車項目',
      })
    }

    // 2. 刪除購物車項目
    await pool.execute(
      'DELETE FROM cart_items WHERE id = ?',
      [itemId]
    )

    return res.json({
      status: 'success',
      message: '成功刪除商品',
    })
  } catch (error) {
    console.error('刪除購物車項目錯誤:', error)
    return res.status(500).json({
      status: 'error',
      message: '刪除購物車項目時發生錯誤',
    })
  }
})

// 清空購物車
router.delete('/clear', async (req, res) => {
  const userId = req.user.id

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
      message: '購物車已清空',
    })
  } catch (error) {
    console.error('清空購物車錯誤:', error)
    return res.status(500).json({
      status: 'error',
      message: '清空購物車時發生錯誤',
    })
  }
})

export default router