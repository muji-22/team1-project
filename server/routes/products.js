// routes/products.js
import express from 'express'
import pool from '../config/db.js'

const router = express.Router()

// 測試路由
router.get('/test', (req, res) => {
  res.json({ message: 'products router 運作正常' })
})

// 取得所有商品(含篩選和分頁)
router.get('/', async (req, res) => {
  try {
    // 0. 取得分頁參數
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const offset = (page - 1) * limit

    // 1. 建立基礎 SQL 查詢 (加入 SQL_CALC_FOUND_ROWS 來計算總筆數)
    let sql = `
      SELECT SQL_CALC_FOUND_ROWS p.*, GROUP_CONCAT(t.name) as tags
      FROM product p
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.valid = 1
    `
    const values = []

    // 2. 根據篩選條件添加 WHERE 子句
    // 2.1 商品名稱搜尋
    if (req.query.search) {
      sql += ` AND p.name LIKE ?`
      values.push(`%${req.query.search}%`)
    }

    // 2.2 遊戲類型標籤篩選
    if (req.query.gametypes && req.query.gametypes.length > 0) {
      const gametypes = JSON.parse(req.query.gametypes)
      if (gametypes.length > 0) {
        sql += ` AND pt.tag_id IN (?)`
        values.push(gametypes)
      }
    }

    // 2.3 人數範圍篩選
    if (req.query.players) {
      const playersOption = parseInt(req.query.players)
      switch(playersOption) {
        case 1: // 1-2人
          sql += ` AND p.min_users <= 2`
          break
        case 2: // 3-5人
          sql += ` AND p.min_users >= 3 AND p.max_users <= 5`
          break
        case 3: // 6人以上
          sql += ` AND p.min_users >= 6`
          break
      }
    }

    // 2.4 遊戲時間篩選
    if (req.query.playtime) {
      const playtimeOption = parseInt(req.query.playtime)
      switch(playtimeOption) {
        case 1: // 30分鐘以下
          sql += ` AND p.playtime = '15' OR p.playtime = '30'`
          break
        case 2: // 30-60分鐘
          sql += ` AND p.playtime = '60'`
          break
        case 3: // 60分鐘以上
          sql += ` AND p.playtime = '60+'`
          break
      }
    }

    // 2.5 年齡範圍篩選
    if (req.query.age) {
      const ageOption = parseInt(req.query.age)
      switch(ageOption) {
        case 1: // 0-6歲
          sql += ` AND p.min_age <= 6`
          break
        case 2: // 6+
          sql += ` AND p.min_age >= 6`
          break
        case 3: // 12+
          sql += ` AND p.min_age >= 12`
          break
        case 4: // 18+
          sql += ` AND p.min_age >= 18`
          break
      }
    }

    // 2.6 價格範圍篩選
    if (req.query.price_min) {
      sql += ` AND p.price >= ?`
      values.push(parseFloat(req.query.price_min))
    }
    if (req.query.price_max) {
      sql += ` AND p.price <= ?`
      values.push(parseFloat(req.query.price_max))
    }

    // 3. 添加分組、排序和分頁
    sql += ` GROUP BY p.id ORDER BY p.id DESC LIMIT ? OFFSET ?`
    values.push(limit, offset)

    // 4. 執行主要查詢
    const [rows] = await pool.query(sql, values)
    
    // 5. 獲取總記錄數
    const [totalRows] = await pool.query('SELECT FOUND_ROWS() as total')
    const total = totalRows[0].total

    // 6. 處理標籤字串轉陣列
    const products = rows.map(product => ({
      ...product,
      tags: product.tags ? product.tags.split(',') : []
    }))

    // 7. 回傳結果，包含分頁資訊
    res.json({
      status: 'success',
      data: {
        products,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      }
    })

  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ 
      status: 'error',
      message: '伺服器錯誤',
      error: error.message 
    })
  }
})

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

    // 處理標籤字串轉陣列
    const product = {
      ...rows[0],
      tags: rows[0].tags ? rows[0].tags.split(',') : []
    }

    res.json(product)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

export default router