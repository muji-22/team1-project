// routes/comment.js
import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'

const router = express.Router()

// 1. 新增評價
router.post('/', authenticateToken, async (req, res) => {
  const { product_id, order_id, comment, score } = req.body
  const user_id = req.user.id

  try {
    // 檢查是否已經評價過
    const [existingComment] = await pool.execute(
      'SELECT * FROM product_comment WHERE user_id = ? AND product_id = ? AND order_id = ?',
      [user_id, product_id, order_id]
    )

    if (existingComment.length > 0) {
      return res.status(400).json({ message: '已經評價過此商品' })
    }

    // 新增評價
    const [result] = await pool.execute(
      'INSERT INTO product_comment (user_id, product_id, order_id, comment, score) VALUES (?, ?, ?, ?, ?)',
      [user_id, product_id, order_id, comment, score]
    )

    res.json({
      status: 'success',
      data: {
        id: result.insertId,
        user_id,
        product_id,
        order_id,
        comment,
        score,
      },
    })
  } catch (error) {
    console.error('新增評價失敗:', error)
    res.status(500).json({ message: '新增評價失敗' })
  }
})

// 2. 取得特定商品的評價列表
router.get('/product/:productId', async (req, res) => {
  const { productId } = req.params
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 5
  const offset = (page - 1) * limit

  try {
    // 取得評價列表與總數
    const [comments] = await pool.execute(
      `SELECT 
        pc.*,
        u.name as user_name,
        u.avatar_url
       FROM product_comment pc
       JOIN users u ON pc.user_id = u.id
       WHERE pc.product_id = ? AND pc.status = 1
       ORDER BY pc.comment_date DESC
       LIMIT ? OFFSET ?`,
      [productId, limit, offset]
    )

    const [total] = await pool.execute(
      'SELECT COUNT(*) as total FROM product_comment WHERE product_id = ? AND status = 1',
      [productId]
    )

    // 計算平均評分
    const [avgScore] = await pool.execute(
      'SELECT AVG(score) as avg_score FROM product_comment WHERE product_id = ? AND status = 1',
      [productId]
    )

    res.json({
      status: 'success',
      data: {
        comments,
        total: total[0].total,
        avg_score: avgScore[0].avg_score || 0,
        current_page: page,
        total_pages: Math.ceil(total[0].total / limit),
      },
    })
  } catch (error) {
    console.error('取得評價列表失敗:', error)
    res.status(500).json({ message: '取得評價列表失敗' })
  }
})

// 3. 修改評價
router.put('/:commentId', authenticateToken, async (req, res) => {
  const { commentId } = req.params
  const { comment, score } = req.body
  const user_id = req.user.id

  try {
    // 檢查是否為評價作者
    const [existingComment] = await pool.execute(
      'SELECT * FROM product_comment WHERE id = ? AND user_id = ?',
      [commentId, user_id]
    )

    if (existingComment.length === 0) {
      return res.status(403).json({ message: '無權限修改此評價' })
    }

    // 更新評價
    await pool.execute(
      'UPDATE product_comment SET comment = ?, score = ? WHERE id = ?',
      [comment, score, commentId]
    )

    res.json({ 
      status: 'success',
      message: '評價更新成功' 
    })
  } catch (error) {
    console.error('修改評價失敗:', error)
    res.status(500).json({ message: '修改評價失敗' })
  }
})

// 4. 刪除評價(軟刪除)
router.delete('/:commentId', authenticateToken, async (req, res) => {
  const { commentId } = req.params
  const user_id = req.user.id

  try {
    // 檢查是否為評價作者
    const [existingComment] = await pool.execute(
      'SELECT * FROM product_comment WHERE id = ? AND user_id = ?',
      [commentId, user_id]
    )

    if (existingComment.length === 0) {
      return res.status(403).json({ message: '無權限刪除此評價' })
    }

    // 軟刪除評價
    await pool.execute(
      'UPDATE product_comment SET status = -1 WHERE id = ?',
      [commentId]
    )

    res.json({ 
      status: 'success',
      message: '評價刪除成功' 
    })
  } catch (error) {
    console.error('刪除評價失敗:', error)
    res.status(500).json({ message: '刪除評價失敗' })
  }
})

export default router