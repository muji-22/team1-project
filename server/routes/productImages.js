// routes/productImages.js
import express from 'express'
import pool from '../config/db.js'

const router = express.Router()

// 取得特定商品的所有圖片
router.get('/:productId', async (req, res) => {
    try {
        const [images] = await pool.execute(
            'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
            [req.params.productId]
        );
        res.json(images);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

export default router