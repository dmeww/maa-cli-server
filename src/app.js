const express = require('express')
const http = require('http')
const cors = require('cors')
const {parse} = require('url')

const {maaRouter, maa} = require('./routes/maa')
const appRouter = require('./routes/app')
const deviceRouter = require('./routes/device')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use('/api/maa', maaRouter)
app.use('/api/app', appRouter)
app.use('/api/device', deviceRouter)

const server = http.createServer(app)

/**
 * WebSocket 服务分流
 */
server.on('upgrade', function upgrade(request, socket, head) {
    const {pathname} = parse(request.url);
    if (pathname === '/api/maa/run') {
        maa.wss.handleUpgrade(request, socket, head, function done(ws) {
            maa.wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});


server.listen(port)

console.log('MAA Cli Server is running on port ' + port,server.address())


