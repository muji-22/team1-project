export const authenticate = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({
        status: 'error',
        message: '請先登入'
      })
    }
    next()
  }