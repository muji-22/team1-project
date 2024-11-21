// routes/productImages.js
import express from 'express'
import pool from '../config/db.js'

const router = express.Router()

// 取得特定商品的所有圖片資訊
router.get('/:productId', async (req, res) => {
    try {
        // 1. 從資料庫獲取圖片資訊
        const [images] = await pool.execute(
            'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
            [req.params.productId]
        );

        if (images.length === 0) {
            // 如果沒有圖片記錄，返回預設圖片
            return res.json([{
                id: 0,
                product_id: req.params.productId,
                url: '/productImages/default-product.png',
                display_order: 1
            }]);
        }

        // 2. 格式化圖片資訊
        const formattedImages = images.map(image => ({
            id: image.id,
            product_id: image.product_id,
            url: `/productImages/${image.product_id}/${image.product_id}-${image.display_order}.jpg`,
            display_order: image.display_order
        }));

        res.json(formattedImages);
    } catch (error) {
        console.error('取得商品圖片失敗:', error);
        res.status(500).json({ 
            status: 'error',
            message: '取得商品圖片失敗'
        });
    }
});

export default router;