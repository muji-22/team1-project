// routes/favorites.js
// 加入收藏的API
const express = require('express');
const router = express.Router();

// 檢查收藏狀態
router.get('/check', async (req, res) => {
  try {
    const { itemId, userId } = req.query;
    const favorite = await Favorite.findOne({ itemId, userId });
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ error: '檢查收藏狀態失敗' });
  }
});

// 添加收藏
router.post('/add', async (req, res) => {
  try {
    const { itemId, userId } = req.body;
    await Favorite.create({ itemId, userId });
    res.json({ message: '成功加入收藏' });
  } catch (error) {
    res.status(500).json({ error: '加入收藏失敗' });
  }
});

// 取消收藏
router.post('/remove', async (req, res) => {
  try {
    const { itemId, userId } = req.body;
    await Favorite.deleteOne({ itemId, userId });
    res.json({ message: '成功取消收藏' });
  } catch (error) {
    res.status(500).json({ error: '取消收藏失敗' });
  }
});

module.exports = router;