import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 取得文章列表 (含分頁)
router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    // 取得文章列表與作者資訊
    const [posts] = await pool.execute(`
      SELECT 
        fp.*,
        u.name as author_name,
        u.avatar_url as author_avatar,
        COUNT(DISTINCT fr.id) as reply_count
      FROM forum_posts fp
      JOIN users u ON fp.user_id = u.id
      LEFT JOIN forum_replies fr ON fp.id = fr.post_id AND fr.status = 1
      WHERE fp.status = 1
      GROUP BY fp.id
      ORDER BY fp.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset])

    // 取得總文章數
    const [total] = await pool.execute(
      'SELECT COUNT(*) as total FROM forum_posts WHERE status = 1'
    )

    res.json({
      status: 'success',
      data: {
        posts,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total[0].total / limit),
          total_items: total[0].total,
          items_per_page: limit
        }
      }
    })
  } catch (error) {
    console.error('取得文章列表失敗:', error)
    res.status(500).json({ 
      status: 'error',
      message: '取得文章列表失敗' 
    })
  }
})

// 取得單一文章與回覆
router.get('/posts/:id', async (req, res) => {
  try {
    // 取得文章資訊
    const [posts] = await pool.execute(`
      SELECT 
        fp.*,
        u.name as author_name,
        u.avatar_url as author_avatar
      FROM forum_posts fp
      JOIN users u ON fp.user_id = u.id
      WHERE fp.id = ? AND fp.status = 1
    `, [req.params.id])

    if (posts.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此文章'
      })
    }

    // 取得回覆列表
    const [replies] = await pool.execute(`
      SELECT 
        fr.*,
        u.name as author_name,
        u.avatar_url as author_avatar
      FROM forum_replies fr
      JOIN users u ON fr.user_id = u.id
      WHERE fr.post_id = ? AND fr.status = 1
      ORDER BY fr.created_at ASC
    `, [req.params.id])

    res.json({
      status: 'success',
      data: {
        post: posts[0],
        replies
      }
    })
  } catch (error) {
    console.error('取得文章失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '取得文章失敗'
    })
  }
})

// 新增文章 (需登入)
router.post('/posts', authenticateToken, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { title, content, cover_image } = req.body // 從請求中獲取 cover_image
    const userId = req.user.id

    // 驗證標題和內容
    if (!title || !content) {
      return res.status(400).json({
        status: 'error',
        message: '標題和內容不能為空'
      })
    }

    await conn.beginTransaction()

    // 新增文章 (加入 cover_image)
    const [result] = await conn.execute(
      'INSERT INTO forum_posts (user_id, title, content, cover_image) VALUES (?, ?, ?, ?)',
      [userId, title, content, cover_image]
    )

    await conn.commit()

    res.status(201).json({
      status: 'success',
      message: '發文成功',
      data: {
        id: result.insertId
      }
    })
  } catch (error) {
    await conn.rollback()
    console.error('發文失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '發文失敗'
    })
  } finally {
    conn.release()
  }
})

// 更新文章 (需登入)
router.put('/posts/:id', authenticateToken, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { title, content, cover_image } = req.body
    const userId = req.user.id
    const postId = req.params.id

    await conn.beginTransaction()

    // 檢查是否為文章作者和獲取舊的圖片資訊
    const [posts] = await conn.execute(
      'SELECT user_id, cover_image as old_cover_image FROM forum_posts WHERE id = ? AND status = 1',
      [postId]
    )

    if (posts.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此文章'
      })
    }

    if (posts[0].user_id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: '無權限編輯此文章'
      })
    }

    // 如果有新的封面圖片且與舊圖片不同，刪除舊圖片
    if (cover_image && posts[0].old_cover_image && cover_image !== posts[0].old_cover_image) {
      const oldImagePath = path.join(__dirname, '../public/uploads/forum', posts[0].old_cover_image)
      try {
        await fs.remove(oldImagePath)
      } catch (error) {
        console.error('刪除舊封面圖片失敗:', error)
      }
    }

    // 更新文章 (加入 cover_image)
    await conn.execute(
      'UPDATE forum_posts SET title = ?, content = ?, cover_image = ? WHERE id = ?',
      [title, content, cover_image, postId]
    )

    await conn.commit()

    res.json({
      status: 'success',
      message: '文章更新成功'
    })
  } catch (error) {
    await conn.rollback()
    console.error('更新文章失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '更新文章失敗'
    })
  } finally {
    conn.release()
  }
})

// 刪除文章 (需登入)
router.delete('/posts/:id', authenticateToken, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const userId = req.user.id
    const postId = req.params.id

    await conn.beginTransaction()

    // 檢查是否為文章作者並獲取封面圖片資訊
    const [posts] = await conn.execute(
      'SELECT user_id, cover_image FROM forum_posts WHERE id = ? AND status = 1',
      [postId]
    )

    if (posts.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此文章'
      })
    }

    if (posts[0].user_id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: '無權限刪除此文章'
      })
    }

    // 軟刪除文章
    await conn.execute(
      'UPDATE forum_posts SET status = 0 WHERE id = ?',
      [postId]
    )

    // 如果有封面圖片，刪除圖片檔案
    if (posts[0].cover_image) {
      const imagePath = path.join(__dirname, '../public/uploads/forum', posts[0].cover_image)
      try {
        await fs.remove(imagePath)
      } catch (error) {
        console.error('刪除封面圖片失敗:', error)
      }
    }

    await conn.commit()

    res.json({
      status: 'success',
      message: '文章刪除成功'
    })
  } catch (error) {
    await conn.rollback()
    console.error('刪除文章失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '刪除文章失敗'
    })
  } finally {
    conn.release()
  }
})

// 新增回覆 (需登入)
router.post('/posts/:id/replies', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body
    const userId = req.user.id
    const postId = req.params.id

    // 檢查文章是否存在
    const [posts] = await pool.execute(
      'SELECT id FROM forum_posts WHERE id = ? AND status = 1',
      [postId]
    )

    if (posts.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此文章'
      })
    }

    // 新增回覆
    const [result] = await pool.execute(
      'INSERT INTO forum_replies (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, userId, content]
    )

    res.status(201).json({
      status: 'success',
      message: '回覆成功',
      data: {
        id: result.insertId
      }
    })
  } catch (error) {
    console.error('回覆失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '回覆失敗'
    })
  }
})

// 刪除回覆 (需登入)
router.delete('/replies/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const replyId = req.params.id

    // 檢查是否為回覆作者
    const [replies] = await pool.execute(
      'SELECT user_id FROM forum_replies WHERE id = ? AND status = 1',
      [replyId]
    )

    if (replies.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此回覆'
      })
    }

    if (replies[0].user_id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: '無權限刪除此回覆'
      })
    }

    // 軟刪除回覆
    await pool.execute(
      'UPDATE forum_replies SET status = 0 WHERE id = ?',
      [replyId]
    )

    res.json({
      status: 'success',
      message: '回覆刪除成功'
    })
  } catch (error) {
    console.error('刪除回覆失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '刪除回覆失敗'
    })
  }
})

// 搜尋文章
router.get('/search', async (req, res) => {
  try {
    const { keyword } = req.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    if (!keyword) {
      return res.status(400).json({
        status: 'error',
        message: '請輸入搜尋關鍵字'
      })
    }

    // 搜尋文章
    const [posts] = await pool.execute(`
      SELECT 
        fp.*,
        u.name as author_name,
        u.avatar_url as author_avatar,
        COUNT(DISTINCT fr.id) as reply_count
      FROM forum_posts fp
      JOIN users u ON fp.user_id = u.id
      LEFT JOIN forum_replies fr ON fp.id = fr.post_id AND fr.status = 1
      WHERE fp.status = 1 
        AND (fp.title LIKE ? OR fp.content LIKE ?)
      GROUP BY fp.id
      ORDER BY fp.created_at DESC
      LIMIT ? OFFSET ?
    `, [`%${keyword}%`, `%${keyword}%`, limit, offset])

    // 取得符合的總文章數
    const [total] = await pool.execute(`
      SELECT COUNT(*) as total 
      FROM forum_posts 
      WHERE status = 1 
        AND (title LIKE ? OR content LIKE ?)
    `, [`%${keyword}%`, `%${keyword}%`])

    res.json({
      status: 'success',
      data: {
        posts,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total[0].total / limit),
          total_items: total[0].total,
          items_per_page: limit
        }
      }
    })
  } catch (error) {
    console.error('搜尋文章失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '搜尋文章失敗'
    })
  }
})

export default router