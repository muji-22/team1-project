import express from 'express'
import pool from '../config/db.js' 
import { v4 } from 'uuid';


const router = express.Router()
const db = pool 

router.post("/api/publish", async (req,res)=>{
  if (req.method === 'POST') {
    console.log("posting artcile");
    try {
      const { title, content } = req.body;
    
      // 建立資料庫連線
      const connection = await mysql.createConnection(pool);
    
      // 寫入資料
      const [result] = await connection.execute(
        'INSERT INTO forum_article (title, content, published_time) VALUES (?, ?, ?)',
        [title, content, new Date()]
      );
  
      await connection.end();
  
      res.status(200).json({ 
        message: '文章發布成功',
        id: result.insertId 
      });
  
    } catch (error) {
      console.error('資料庫錯誤:', error);
      res.status(500).json({ message: '伺服器錯誤' });
    }
  } else {
  res.status(405).json({ message: '不支援的請求方法' });
  }
})

export default router