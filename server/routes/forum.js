// routes/forum.js
import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from '../middlewares/auth.js'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 輔助函數：從文章內容提取圖片
function extractImagesFromContent(content) {
  if (!content) return [];
  
  try {
    // 去除任何 HTML encode
    content = content.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    
    const images = new Set(); // 使用 Set 來避免重複
    
    // 針對編輯器的圖片格式進行匹配
    // 同時處理一般的 <img> 標籤和編輯器特殊格式
    const regex = /<img[^>]+src="([^">]+)"[^>]*>|"url":"([^"]+)"/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // match[1] 是一般 img 標籤的 src
      // match[2] 是編輯器特殊格式的 url
      const imageUrl = match[1] || match[2];
      
      if (imageUrl && imageUrl.includes('/uploads/forum/')) {
        // 取得檔名
        const filename = imageUrl.split('/').pop();
        // 基本的檔名驗證
        if (filename && !filename.includes('..') && !filename.includes('/')) {
          images.add(filename);
        }
      }
    }

    console.log('Extracted images:', Array.from(images)); // 用於除錯
    return Array.from(images);

  } catch (error) {
    console.error('解析內容圖片失敗:', error);
    return [];
  }
}

// 輔助函數：刪除單個圖片
async function deleteImage(filename, basePath) {
  if (!filename) return false;

  try {
    const imagePath = path.join(basePath, filename);
    if (await fs.pathExists(imagePath)) {
      await fs.remove(imagePath);
      console.log(`成功刪除圖片: ${filename}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`刪除圖片失敗: ${filename}`, error);
    return false;
  }
}

// 輔助函數：批次刪除圖片
async function deleteImages(images, basePath) {
  const results = [];
  for (const filename of images) {
    try {
      const success = await deleteImage(filename, basePath);
      results.push({
        filename,
        success
      });
    } catch (error) {
      results.push({
        filename,
        success: false,
        error: error.message
      });
    }
  }
  return results;
}

// 確保上傳目錄存在
const uploadDir = path.join(__dirname, '../public/uploads/forum');
fs.ensureDir(uploadDir)
  .then(() => console.log('Upload directory is ready'))
  .catch(err => console.error('Error creating upload directory:', err));

  // 取得文章列表 (含分頁)
router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
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
    const { title, content, cover_image } = req.body
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

    // 檢查是否為文章作者和獲取舊文章資訊
    const [posts] = await conn.execute(
      'SELECT user_id, content, cover_image as old_cover_image FROM forum_posts WHERE id = ? AND status = 1',
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

    // 比較新舊內容中的圖片差異
    const oldImages = extractImagesFromContent(posts[0].content)
    const newImages = extractImagesFromContent(content)

    // 找出需要刪除的圖片（在舊內容中但不在新內容中的圖片）
    const imagesToDelete = oldImages.filter(img => !newImages.includes(img))

    // 如果封面圖片有更換，也加入要刪除的清單
    if (posts[0].old_cover_image && 
        cover_image !== posts[0].old_cover_image) {
      imagesToDelete.push(posts[0].old_cover_image)
    }

    // 刪除不再使用的圖片
    await deleteImages(imagesToDelete, uploadDir)

    // 更新文章內容
    await conn.execute(
      'UPDATE forum_posts SET title = ?, content = ?, cover_image = ? WHERE id = ?',
      [title, content, cover_image, postId]
    )

    await conn.commit()

    res.json({
      status: 'success',
      message: '文章更新成功',
      data: {
        deletedImages: imagesToDelete
      }
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

    // 檢查是否為文章作者並獲取文章資訊
    const [posts] = await conn.execute(
      'SELECT user_id, content, cover_image FROM forum_posts WHERE id = ? AND status = 1',
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

    // 找出所有需要刪除的圖片
    const contentImages = extractImagesFromContent(posts[0].content)
    const imagesToDelete = [...contentImages]
    
    if (posts[0].cover_image) {
      imagesToDelete.push(posts[0].cover_image)
    }

    // 刪除圖片檔案
    await deleteImages(imagesToDelete, uploadDir)

    // 軟刪除文章
    await conn.execute(
      'UPDATE forum_posts SET status = 0 WHERE id = ?',
      [postId]
    )

    await conn.commit()

    res.json({
      status: 'success',
      message: '文章刪除成功',
      data: {
        deletedImages: imagesToDelete
      }
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
  const conn = await pool.getConnection()
  try {
    const { content } = req.body
    const userId = req.user.id
    const postId = req.params.id

    await conn.beginTransaction()

    // 檢查文章是否存在
    const [posts] = await conn.execute(
      'SELECT id FROM forum_posts WHERE id = ? AND status = 1',
      [postId]
    )

    if (posts.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此文章'
      })
    }

    // 處理回覆內容中的圖片
    const contentImages = extractImagesFromContent(content)

    // 新增回覆
    const [result] = await conn.execute(
      'INSERT INTO forum_replies (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, userId, content]
    )

    await conn.commit()

    res.status(201).json({
      status: 'success',
      message: '回覆成功',
      data: {
        id: result.insertId,
        contentImages // 回傳圖片資訊，方便追蹤
      }
    })
  } catch (error) {
    await conn.rollback()
    console.error('回覆失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '回覆失敗'
    })
  } finally {
    conn.release()
  }
})

// 修改回覆 (需登入)
router.put('/replies/:id', authenticateToken, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { content } = req.body
    const userId = req.user.id
    const replyId = req.params.id

    await conn.beginTransaction()

    // 檢查是否為回覆作者並獲取原回覆內容
    const [replies] = await conn.execute(
      'SELECT user_id, content FROM forum_replies WHERE id = ? AND status = 1',
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
        message: '無權限編輯此回覆'
      })
    }

    // 比較新舊內容中的圖片差異
    const oldImages = extractImagesFromContent(replies[0].content)
    const newImages = extractImagesFromContent(content)
    const imagesToDelete = oldImages.filter(img => !newImages.includes(img))

    // 刪除不再使用的圖片
    await deleteImages(imagesToDelete, uploadDir)

    // 更新回覆內容
    await conn.execute(
      'UPDATE forum_replies SET content = ? WHERE id = ?',
      [content, replyId]
    )

    await conn.commit()

    res.json({
      status: 'success',
      message: '回覆更新成功',
      data: {
        deletedImages: imagesToDelete
      }
    })
  } catch (error) {
    await conn.rollback()
    console.error('更新回覆失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '更新回覆失敗'
    })
  } finally {
    conn.release()
  }
})

// 刪除回覆 (需登入)
router.delete('/replies/:id', authenticateToken, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const userId = req.user.id
    const replyId = req.params.id

    await conn.beginTransaction()

    // 檢查是否為回覆作者並獲取內容
    const [replies] = await conn.execute(
      'SELECT user_id, content FROM forum_replies WHERE id = ? AND status = 1',
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

    // 找出回覆中的所有圖片
    const imagesToDelete = extractImagesFromContent(replies[0].content)

    // 刪除圖片檔案
    await deleteImages(imagesToDelete, uploadDir)

    // 軟刪除回覆
    await conn.execute(
      'UPDATE forum_replies SET status = 0 WHERE id = ?',
      [replyId]
    )

    await conn.commit()

    res.json({
      status: 'success',
      message: '回覆刪除成功',
      data: {
        deletedImages: imagesToDelete
      }
    })
  } catch (error) {
    await conn.rollback()
    console.error('刪除回覆失敗:', error)
    res.status(500).json({
      status: 'error',
      message: '刪除回覆失敗'
    })
  } finally {
    conn.release()
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