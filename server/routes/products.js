import express from 'express'
import { authenticate } from '../middlewares/authenticate.js'
const router = express.Router()

// 取得所有商品
router.get('/', async (req, res, next) => {
  try {
    // TODO: 資料庫查詢
    const products = [] // 之後改成實際的資料

    res.json({
      status: 'success',
      data: products
    })
  } catch (error) {
    next(error)
  }
})

// 取得單一商品
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    // TODO: 資料庫查詢
    const product = {} // 之後改成實際的資料

    res.json({
      status: 'success',
      data: product
    })
  } catch (error) {
    next(error)
  }
})

// 新增商品 (需要登入)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name, price, description } = req.body

    // 檢查必要欄位
    if (!name || !price) {
      return res.status(400).json({
        status: 'error',
        message: '商品名稱和價格是必填的'
      })
    }

    // TODO: 資料庫操作

    res.json({
      status: 'success',
      message: '商品新增成功'
    })
  } catch (error) {
    next(error)
  }
})

export default router