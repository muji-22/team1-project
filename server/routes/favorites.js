// routes/favorites.js
import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'

const router = express.Router()

// 獲取使用者的收藏列表
router.get('/', authenticateToken, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const userId = req.user.id
    const [favorites] = await conn.query(`
      SELECT f.*, p.name, p.price, p.image 
      FROM favorites f
      JOIN product p ON f.product_id = p.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `, [userId])
    
    res.json({ 
      status: 'success', 
      data: favorites.map(item => ({
        ...item,
        price: parseInt(item.price)  // 確保價格是數字
      }))
    })
  } catch (error) {
    console.error('獲取收藏列表失敗:', error)
    res.status(500).json({ status: 'error', message: '獲取收藏列表失敗' })
  } finally {
    conn.release()
  }
})

// 檢查是否已收藏特定商品
router.get('/check/:productId', authenticateToken, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const userId = req.user.id
    const { productId } = req.params

    const [favorites] = await conn.query(
      'SELECT 1 FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    )

    res.json({ 
      status: 'success', 
      data: { isFavorited: favorites.length > 0 }
    })
  } catch (error) {
    console.error('檢查收藏狀態失敗:', error)
    res.status(500).json({ status: 'error', message: '檢查收藏狀態失敗' })
  } finally {
    conn.release()
  }
})

// 新增收藏
router.post('/:productId', authenticateToken, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const userId = req.user.id
    const { productId } = req.params

    // 檢查商品是否存在
    const [products] = await conn.query(
      'SELECT id FROM product WHERE id = ?',
      [productId]
    )
    if (products.length === 0) {
      return res.status(404).json({ status: 'error', message: '商品不存在' })
    }

    // 新增收藏
    await conn.query(
      'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    )

    res.json({ status: 'success', message: '收藏成功' })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ status: 'error', message: '已經收藏過此商品' })
    }
    console.error('新增收藏失敗:', error)
    res.status(500).json({ status: 'error', message: '新增收藏失敗' })
  } finally {
    conn.release()
  }
})

// 刪除收藏
router.delete('/:productId', authenticateToken, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const userId = req.user.id
    const { productId } = req.params

    const [result] = await conn.query(
      'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: '找不到此收藏紀錄' })
    }

    res.json({ status: 'success', message: '刪除收藏成功' })
  } catch (error) {
    console.error('刪除收藏失敗:', error)
    res.status(500).json({ status: 'error', message: '刪除收藏失敗' })
  } finally {
    conn.release()
  }
})

export default router