import express from 'express';
import cors from 'cors';
import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 設置 CORS
router.use(cors({
  origin: 'http://localhost:3000', // 前端應用的地址
  credentials: true
}));

// 確保能解析 JSON
router.use(express.json());

// 修改路由路徑（移除 api 前綴，因為可能在主應用中已經添加）
router.post("/forumpublish", async (req, res) => {
  try {
    console.log('Received request body:', req.body); // 調試日誌
    
    const { title, content } = req.body;

    // 驗證請求數據
    if (!title || !content) {
      console.log('Missing title or content'); // 調試日誌
      return res.status(400).json({
        success: false,
        message: '標題和內容不能為空'
      });
    }

    // 使用連接池獲取連接
    const connection = await pool.getConnection();

    try {
      const articleId = uuidv4();
      
      const query = `
        INSERT INTO forum_article 
        (id, title, content, published_time) 
        VALUES (?, ?, ?, ?)
      `;
      
      const [result] = await connection.execute(query, [
        articleId,
        title,
        content,
        new Date()
      ]);

      console.log('Article published successfully:', articleId); // 調試日誌

      return res.status(200).json({
        success: true,
        message: '文章發布成功',
        data: {
          id: articleId,
          title,
          publishedTime: new Date()
        }
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({
        success: false,
        message: '資料庫操作失敗',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: '伺服器內部錯誤',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;