// 商品的API
import express from 'express'
import pool from '../database/connect.js'  // 改成 connect.js

const router = express.Router()

// 測試路由
router.get('/test', (req, res) => {
  res.json({ message: 'products router 運作正常' })
})

router.get('/', async (req, res) => {
  try {
    // 先測試簡單的查詢
    const [rows] = await pool.query('SELECT * FROM product')
    console.log('查詢結果:', rows)  // 檢查結果
    res.json(rows)
  } catch (error) {
    // 更詳細的錯誤訊息
    console.error('錯誤類型:', error.name)
    console.error('錯誤訊息:', error.message)
    console.error('SQL語句:', error.sql)
    res.status(500).json({ 
      message: '伺服器錯誤',
      error: error.message  // 讓前端也能看到錯誤訊息
    })
  }
})

// 取得所有商品
// router.get('/', async (req, res) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT p.*, GROUP_CONCAT(t.name) as tags
//       FROM product p
//       LEFT JOIN product_tags pt ON p.id = pt.product_id
//       LEFT JOIN tags t ON pt.tag_id = t.id
//       WHERE p.valid = 1
//       GROUP BY p.id
//     `)
//     res.json(rows)
//   } catch (error) {
//     console.error('Error:', error)
//     res.status(500).json({ message: '伺服器錯誤' })
//   }
// })

// 取得單一商品
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, GROUP_CONCAT(t.name) as tags
      FROM product p
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ? AND p.valid = 1
      GROUP BY p.id
    `, [req.params.id])

    if (rows.length === 0) {
      return res.status(404).json({ message: '找不到商品' })
    }

    res.json(rows[0])
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

export default router