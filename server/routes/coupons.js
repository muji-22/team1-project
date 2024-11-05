// routes/coupons.js
import express from 'express';
import pool from '../config/db.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// 1. 獲取所有優惠券列表 (公開)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM coupons WHERE valid = 1 AND end_date >= CURDATE()'
        );
        res.json(rows);
    } catch (error) {
        console.error('獲取優惠券列表失敗：', error);
        res.status(500).json({ message: '獲取優惠券列表失敗' });
    }
});

// 2. 獲取單一優惠券詳情 (公開)
router.get('/detail/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM coupons WHERE id = ? AND valid = 1',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: '找不到該優惠券' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('獲取優惠券詳情失敗：', error);
        res.status(500).json({ message: '獲取優惠券詳情失敗' });
    }
});

// 3. 獲取用戶的優惠券列表 (需要驗證)
router.get('/user/:userId', authenticateToken, async (req, res) => {
    // 確保用戶只能查看自己的優惠券
    if (req.user.id !== parseInt(req.params.userId)) {
        return res.status(403).json({ message: '無權訪問此資源' });
    }

    try {
        const [rows] = await pool.query(
            `SELECT 
                c.*, 
                uc.received_time, 
                uc.expire_time, 
                uc.used_time,
                CASE 
                    WHEN uc.used_time IS NOT NULL THEN 'used'
                    WHEN c.end_date < CURDATE() THEN 'expired'
                    ELSE 'valid'
                END as status
            FROM coupons c
            JOIN user_coupons uc ON c.id = uc.coupon_id
            WHERE uc.user_id = ? AND c.valid = 1
            ORDER BY 
                CASE 
                    WHEN uc.used_time IS NULL AND c.end_date >= CURDATE() THEN 1
                    WHEN uc.used_time IS NOT NULL THEN 2
                    ELSE 3
                END,
                c.end_date ASC`,
            [req.params.userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('獲取用戶優惠券失敗：', error);
        res.status(500).json({ message: '獲取用戶優惠券失敗' });
    }
});

// 4. 新增優惠券 (需要管理員權限)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    const { name, code, type, discount, start_date, end_date, apply_to } = req.body;

    // 驗證必要欄位
    if (!name || !code || !type || !discount || !start_date || !end_date || !apply_to) {
        return res.status(400).json({ message: '所有欄位都是必填的' });
    }

    // 驗證日期
    if (new Date(end_date) <= new Date(start_date)) {
        return res.status(400).json({ message: '結束日期必須大於開始日期' });
    }

    try {
        // 檢查優惠碼是否已存在
        const [existing] = await pool.query(
            'SELECT id FROM coupons WHERE code = ?',
            [code]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: '優惠碼已存在' });
        }

        const [result] = await pool.query(
            'INSERT INTO coupons (name, code, type, discount, start_date, end_date, apply_to) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, code, type, discount, start_date, end_date, apply_to]
        );
        res.status(201).json({ 
            id: result.insertId, 
            message: '新增優惠券成功' 
        });
    } catch (error) {
        console.error('新增優惠券失敗：', error);
        res.status(500).json({ message: '新增優惠券失敗' });
    }
});

// 5. 修改優惠券 (需要管理員權限)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { name, code, type, discount, start_date, end_date, apply_to, valid } = req.body;

    // 驗證必要欄位
    if (!name || !code || !type || !discount || !start_date || !end_date || !apply_to) {
        return res.status(400).json({ message: '所有欄位都是必填的' });
    }

    try {
        // 檢查優惠券是否存在
        const [existing] = await pool.query(
            'SELECT id FROM coupons WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: '找不到該優惠券' });
        }

        // 檢查優惠碼是否重複（排除自己）
        const [duplicateCode] = await pool.query(
            'SELECT id FROM coupons WHERE code = ? AND id != ?',
            [code, req.params.id]
        );

        if (duplicateCode.length > 0) {
            return res.status(400).json({ message: '優惠碼已存在' });
        }

        await pool.query(
            'UPDATE coupons SET name=?, code=?, type=?, discount=?, start_date=?, end_date=?, apply_to=?, valid=? WHERE id=?',
            [name, code, type, discount, start_date, end_date, apply_to, valid, req.params.id]
        );
        res.json({ message: '更新優惠券成功' });
    } catch (error) {
        console.error('更新優惠券失敗：', error);
        res.status(500).json({ message: '更新優惠券失敗' });
    }
});

// 6. 刪除優惠券 (需要管理員權限)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        // 檢查優惠券是否存在
        const [existing] = await pool.query(
            'SELECT id FROM coupons WHERE id = ? AND valid = 1',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: '找不到該優惠券' });
        }

        await pool.query(
            'UPDATE coupons SET valid = 0 WHERE id = ?',
            [req.params.id]
        );
        res.json({ message: '刪除優惠券成功' });
    } catch (error) {
        console.error('刪除優惠券失敗：', error);
        res.status(500).json({ message: '刪除優惠券失敗' });
    }
});

// 7. 使用者領取優惠券 (需要驗證)
router.post('/claim/:couponId', authenticateToken, async (req, res) => {
    const userId = req.user.id; // 從 token 中獲取用戶 ID

    try {
        // 檢查優惠券是否有效
        const [coupon] = await pool.query(
            'SELECT * FROM coupons WHERE id = ? AND valid = 1 AND start_date <= CURDATE() AND end_date >= CURDATE()',
            [req.params.couponId]
        );
        
        if (coupon.length === 0) {
            return res.status(400).json({ message: '優惠券不存在或不在有效期內' });
        }

        // 檢查用戶是否已經領取過此優惠券
        const [existing] = await pool.query(
            'SELECT * FROM user_coupons WHERE user_id = ? AND coupon_id = ?',
            [userId, req.params.couponId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: '已經領取過此優惠券' });
        }

        // 新增用戶優惠券記錄
        await pool.query(
            'INSERT INTO user_coupons (user_id, coupon_id, expire_time) VALUES (?, ?, ?)',
            [userId, req.params.couponId, coupon[0].end_date]
        );

        res.json({ message: '領取優惠券成功' });
    } catch (error) {
        console.error('領取優惠券失敗：', error);
        res.status(500).json({ message: '領取優惠券失敗' });
    }
});

// 8. 使用優惠券 (需要驗證)
router.put('/use/:couponId', authenticateToken, async (req, res) => {
    const userId = req.user.id; // 從 token 中獲取用戶 ID

    try {
        // 檢查優惠券是否存在且可用
        const [userCoupon] = await pool.query(
            `SELECT uc.*, c.valid, c.end_date 
             FROM user_coupons uc
             JOIN coupons c ON uc.coupon_id = c.id
             WHERE uc.user_id = ? AND uc.coupon_id = ? AND uc.used_time IS NULL`,
            [userId, req.params.couponId]
        );

        if (userCoupon.length === 0) {
            return res.status(400).json({ message: '找不到可用的優惠券' });
        }

        // 檢查優惠券是否過期
        if (!userCoupon[0].valid || new Date(userCoupon[0].end_date) < new Date()) {
            return res.status(400).json({ message: '優惠券已失效或過期' });
        }

        // 標記優惠券為已使用
        await pool.query(
            'UPDATE user_coupons SET used_time = CURRENT_TIMESTAMP WHERE user_id = ? AND coupon_id = ?',
            [userId, req.params.couponId]
        );

        res.json({ message: '使用優惠券成功' });
    } catch (error) {
        console.error('使用優惠券失敗：', error);
        res.status(500).json({ message: '使用優惠券失敗' });
    }
});

export default router;