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
      return res.status(400).json({ 
        status: 'error',
        message: '已經評價過此商品' 
      })
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
    res.status(500).json({ 
      status: 'error',
      message: '新增評價失敗' 
    })
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
    res.status(500).json({ 
      status: 'error',
      message: '取得評價列表失敗' 
    })
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
      return res.status(403).json({ 
        status: 'error',
        message: '無權限修改此評價' 
      })
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
    res.status(500).json({ 
      status: 'error',
      message: '修改評價失敗' 
    })
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
      return res.status(403).json({ 
        status: 'error',
        message: '無權限刪除此評價' 
      })
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
    res.status(500).json({ 
      status: 'error',
      message: '刪除評價失敗' 
    })
  }
})

// 5. 獲取可評價訂單
router.get('/product/:productId/orders', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  try {
    const [orders] = await pool.execute(
      `SELECT DISTINCT o.id, o.created_at
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN product_comment pc 
         ON o.id = pc.order_id 
         AND oi.product_id = pc.product_id
         AND pc.user_id = o.user_id
       WHERE o.user_id = ?
         AND oi.product_id = ?
         AND o.order_status = 3  # 已完成的訂單
         AND pc.id IS NULL  # 尚未評價的訂單
       ORDER BY o.created_at DESC`,
      [userId, productId]
    );

    res.json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    console.error('獲取可評價訂單失敗:', error);
    res.status(500).json({ 
      status: 'error',
      message: '獲取可評價訂單失敗'
    });
  }
});

// routes/comment.js
// 修改 取得高分商品列表 的SQL查詢

router.get('/top-rated', async (req, res) => {
  try {
    // 修改 SQL 查詢，只顯示有評分的商品
    const [products] = await pool.execute(`
      SELECT 
        p.*,
        ROUND(AVG(pc.score), 1) as avg_score,
        COUNT(DISTINCT pc.id) as review_count
      FROM product p
      INNER JOIN product_comment pc ON p.id = pc.product_id
      WHERE p.valid = 1 
        AND pc.status = 1
      GROUP BY p.id
      HAVING review_count > 0
      ORDER BY 
        avg_score DESC,
        review_count DESC,
        p.id DESC
      LIMIT 12
    `);

    // 格式化資料
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      avg_score: Number(product.avg_score).toFixed(1),
      review_count: parseInt(product.review_count),
      description: product.description,
      min_users: product.min_users,
      max_users: product.max_users,
      min_age: product.min_age,
      playtime: product.playtime
    }));

    res.json({
      status: 'success',
      data: formattedProducts
    });

  } catch (error) {
    console.error('取得高分商品失敗:', error);
    res.status(500).json({ 
      status: 'error',
      message: '取得高分商品失敗'
    });
  }
});

export default router;