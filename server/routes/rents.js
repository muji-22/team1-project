// routes/rents.js
import express from 'express'
import pool from '../config/db.js'

const router = express.Router()

// 取得所有租賃商品(含篩選和分頁)
router.get('/', async (req, res) => {
  try {
    // 0. 取得分頁參數
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const offset = (page - 1) * limit

    // 1. 建立基礎 SQL 查詢
    let sql = `
      SELECT SQL_CALC_FOUND_ROWS r.*, GROUP_CONCAT(t.name) as tags
      FROM rent r
      LEFT JOIN product_tags pt ON r.id = pt.product_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE r.valid = 1
    `
    const values = []

    // 2. 根據篩選條件添加 WHERE 子句
    // 2.1 商品名稱搜尋
    if (req.query.search) {
      sql += ` AND r.name LIKE ?`
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
          sql += ` AND r.min_users <= 2`
          break
        case 2: // 3-5人
          sql += ` AND r.min_users >= 3 AND r.max_users <= 5`
          break
        case 3: // 6人以上
          sql += ` AND r.min_users >= 6`
          break
      }
    }

    // 2.4 遊戲時間篩選
    if (req.query.playtime) {
      const playtimeOption = parseInt(req.query.playtime)
      switch(playtimeOption) {
        case 1: // 30分鐘以下
          sql += ` AND r.playtime = '15' OR r.playtime = '30'`
          break
        case 2: // 30-60分鐘
          sql += ` AND r.playtime = '60'`
          break
        case 3: // 60分鐘以上
          sql += ` AND r.playtime = '60+'`
          break
      }
    }

    // 2.5 年齡範圍篩選
    if (req.query.age) {
      const ageOption = parseInt(req.query.age)
      switch(ageOption) {
        case 1: // 0-6歲
          sql += ` AND r.min_age <= 6`
          break
        case 2: // 6+
          sql += ` AND r.min_age >= 6`
          break
        case 3: // 12+
          sql += ` AND r.min_age >= 12`
          break
        case 4: // 18+
          sql += ` AND r.min_age >= 18`
          break
      }
    }

    // 2.6 租金範圍篩選
    if (req.query.rental_fee_min) {
      sql += ` AND r.rental_fee >= ?`
      values.push(parseFloat(req.query.rental_fee_min))
    }
    if (req.query.rental_fee_max) {
      sql += ` AND r.rental_fee <= ?`
      values.push(parseFloat(req.query.rental_fee_max))
    }

    // 3. 添加分組、排序和分頁
sql += ` GROUP BY r.id`;

// 新增價格排序選項
if (req.query.sort_rental_fee) {
  if (req.query.sort_rental_fee === 'asc') {
    sql += ` ORDER BY r.rental_fee ASC`;
  } else if (req.query.sort_rental_fee === 'desc') {
    sql += ` ORDER BY r.rental_fee DESC`;
  }
} else {
  sql += ` ORDER BY r.id ASC`;
}

sql += ` LIMIT ? OFFSET ?`;
values.push(limit, offset);

    // 4. 執行主要查詢
    const [rows] = await pool.query(sql, values)
    
    // 5. 獲取總記錄數
    const [totalRows] = await pool.query('SELECT FOUND_ROWS() as total')
    const total = totalRows[0].total

    // 6. 處理標籤字串轉陣列
    const rents = rows.map(rent => ({
      ...rent,
      tags: rent.tags ? rent.tags.split(',') : []
    }))

    // 7. 回傳結果
    res.json({
      status: 'success',
      data: {
        rents,
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

// 取得單一租賃商品
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, GROUP_CONCAT(t.name) as tags
      FROM rent r
      LEFT JOIN product_tags pt ON r.id = pt.product_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE r.id = ? AND r.valid = 1
      GROUP BY r.id
    `, [req.params.id])

    if (rows.length === 0) {
      return res.status(404).json({ message: '找不到租賃商品' })
    }

    // 處理標籤字串轉陣列
    const rent = {
      ...rows[0],
      tags: rows[0].tags ? rows[0].tags.split(',') : []
    }

    res.json(rent)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

export default router