// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    // 記錄錯誤
    console.error(`[Error] ${err.message}`.red)

    // 設定本地變數，只在開發環境提供錯誤訊息
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // 回傳錯誤
    res.status(err.status || 500)
    res.json({
        status: 'error',
        message: req.app.get('env') === 'development' ? err.message : '服務器錯誤'
    })
}