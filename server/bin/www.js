import app from '../app.js'
import debugLib from 'debug'
import http from 'http'
import { exit } from 'node:process'
import 'dotenv/config.js'

const debug = debugLib('node-express-es6:server')

// 設定 port
const port = normalizePort(process.env.PORT || '6005')
app.set('port', port)

// 創建 HTTP server
const server = http.createServer(app)

// 監聽指定的 port
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

// 正規化 port
function normalizePort(val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }

    if (port >= 0) {
        return port
    }

    return false
}

// 錯誤處理
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' 需要提升權限')
            exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' 已被使用')
            exit(1)
            break
        default:
            throw error
    }
}

// 監聽處理
function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    debug('Listening on ' + bind)
    
    // 加入連線成功的提示
    console.log('='.repeat(50))
    console.log(`🚀 伺服器已啟動: http://localhost:${port}`)
    console.log('='.repeat(50))
}