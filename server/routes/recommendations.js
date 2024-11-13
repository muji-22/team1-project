// routes/recommendations.js
import express from 'express'
import pool from '../config/db.js'

const router = express.Router()

// 基於標籤的推薦
router.get('/by-tags/:productId', async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { productId } = req.params
    const limit = parseInt(req.query.limit) || 4

    // 取得商品標籤
    const [tags] = await conn.query(
      `
      SELECT tag_id 
      FROM product_tags 
      WHERE product_id = ?
    `,
      [productId]
    )

    if (tags.length === 0) {
      return res.json({
        status: 'success',
        data: [],
      })
    }

    const tagIds = tags.map((t) => t.tag_id)

    // 基於標籤推薦相似商品
    const [products] = await conn.query(
      `
      SELECT DISTINCT p.*, COUNT(pt.tag_id) as matching_tags
      FROM product p
      JOIN product_tags pt ON p.id = pt.product_id 
      WHERE pt.tag_id IN (?) 
      AND p.id != ? 
      AND p.valid = 1
      GROUP BY p.id
      ORDER BY matching_tags DESC, RAND()
      LIMIT ?
    `,
      [tagIds, productId, limit]
    )

    res.json({
      status: 'success',
      data: products,
    })
  } catch (error) {
    console.error('取得標籤推薦失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '取得推薦商品失敗',
    })
  } finally {
    conn.release()
  }
})

// 基於價格的推薦
router.get('/by-price/:productId', async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { productId } = req.params
    const { price } = req.query
    const limit = parseInt(req.query.limit) || 4
    const priceRange = 0.3 // 上下 30%

    const minPrice = price * (1 - priceRange)
    const maxPrice = price * (1 + priceRange)

    const [products] = await conn.query(
      `
      SELECT * FROM product 
      WHERE price BETWEEN ? AND ?
      AND id != ?
      AND valid = 1
      ORDER BY ABS(price - ?) ASC, RAND()
      LIMIT ?
    `,
      [minPrice, maxPrice, productId, price, limit]
    )

    res.json({
      status: 'success',
      data: products,
    })
  } catch (error) {
    console.error('取得價格推薦失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '取得推薦商品失敗',
    })
  } finally {
    conn.release()
  }
})

// 基於遊戲特性的推薦
router.get('/by-features/:productId', async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { productId } = req.params
    const { min_users, max_users, min_age } = req.query
    const limit = parseInt(req.query.limit) || 4

    const [products] = await conn.query(
      `
      SELECT *, 
        ABS(min_users - ?) + 
        ABS(max_users - ?) + 
        ABS(min_age - ?) AS diff_score
      FROM product 
      WHERE valid = 1
      AND id != ?
      HAVING diff_score <= 10
      ORDER BY diff_score ASC, RAND()
      LIMIT ?
    `,
      [min_users, max_users, min_age, productId, limit]
    )

    res.json({
      status: 'success',
      data: products,
    })
  } catch (error) {
    console.error('取得特性推薦失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '取得推薦商品失敗',
    })
  } finally {
    conn.release()
  }
})

// 隨機推薦(備用)
router.get('/random/:productId', async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { productId } = req.params
    const limit = parseInt(req.query.limit) || 4

    const [products] = await conn.query(
      `
      SELECT * FROM product
      WHERE id != ?
      AND valid = 1
      ORDER BY RAND()
      LIMIT ?
    `,
      [productId, limit]
    )

    res.json({
      status: 'success',
      data: products,
    })
  } catch (error) {
    console.error('取得隨機推薦失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '取得推薦商品失敗',
    })
  } finally {
    conn.release()
  }
})

export default router
