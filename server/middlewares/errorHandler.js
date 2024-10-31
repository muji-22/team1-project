// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: '伺服器錯誤' });
  };
  
  // middleware/validateProduct.js
  const validateProduct = (req, res, next) => {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: '缺少必要欄位' });
    }
    next();
  };