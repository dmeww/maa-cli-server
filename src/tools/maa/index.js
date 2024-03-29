const cp = require('child_process')
const {WebSocketServer} = require("ws");
const Timer = require('./timer')
const file = require('../file')
const configTool = require('../config')
const Msg = require("./msg");
const {onHook, Hook} = require('../hook')
const device = require('../device')
const App = require('../app')

class MAA {

    /**
     *  任务队列, 队列中的任务会逐个执行
     * @type {Task[]}
     */
    taskQueue = []
    /**
     *  定时任务存储
     * @type {Map<String, Timer>}
     */
    timerMap = new Map()
    /**
     *  MAA 运行状态
     * @type {{task: Task || null, len: number, running: boolean}}
     */
    status = {
        running: false,
        task: null,
        len: 0,
    }
    /**
     *  日志WebSocket服务
     * @type {WebSocketServer|| null}
     */
    wss = null
    /**
     *  运行日志
     * @type {string}
     */
    runLog = ''
    /**
     * webui服务配置
     * @type {App}
     */
    app = new App()


    constructor() {
        this.buildMaaLogServer()
    }

    /**
     *
     * @param {Task} task
     */
    addTask(task) {
        return new Promise((resolve, reject) => {
            this.taskQueue.push(task)
            this.run();
        });
    }

    /**
     *
     * @param {Task} task
     * @param {string} hour
     * @param {string} minute
     * @returns {Promise<void>}
     */
    addTimerTask(task, hour, minute) {
        return new Promise(() => {
            let timer = new Timer(`${minute} ${hour} * * *`, task, () => {
                this.taskQueue.push(task)
                this.run()
            })
            this.timerMap.set(task.uuid, timer)
            timer.start()
        })
    }

    /**
     *
     * @param {string} taskUUID
     * @return boolean
     */
    removeTimerTask(taskUUID) {
        try {
            this.timerMap.get(taskUUID).stop()
            this.timerMap.delete(taskUUID)
        } catch (e) {
            console.log('删除定时任务失败 :=> ' + e.message)
            return false
        }
        return true
    }

    /**
     * @return boolean
     */
    stopCurrentTask() {
        try {
            cp.execSync('pkill maa')
        } catch (error) {
            return false
        }
        return true
    }


    /**
     * 任务执行方法 当有别的任务正在运行时, 等待3秒后重新执行
     */
    run() {

        if (this.status.running) {
            setTimeout(() => {
                this.run()
            }, 3000)
            return
        }

        let task = this.taskQueue.shift()
        this.status.running = true
        this.status.task = task
        this.status.len = this.taskQueue.length
        this.broadcast(Msg.StatusInstance(this.status))

        const complete = () => {
            this.status.running = false
            this.status.task = null
            this.status.len = this.taskQueue.length
            this.broadcast(Msg.StatusInstance(this.status))
            onHook(this.app.webHook, this.runLog)
            this.runLog = ''
            file.removeMaaTask(task.uuid)
            device.closeDevice()
        }

        if (task === undefined) {
            console.log('获取到 undefined 任务, 请检查代码')
            complete()
            return;
        }
        device.openDevice()
        file.saveMaaTask(task)

        let childProcess = cp.spawn('sh', [configTool.scripts.maa, task.uuid])

        // 日志输出
        childProcess.stdout.on('data', data => {
            const log = data.toString();
            if (!log.startsWith('[INFO]') && !log.includes('onnxruntime')) {
                log.replace('[', '\n[')
                this.runLog += log
                this.broadcast(Msg.LogInstance(log))
            }
        });
        // 正常退出
        childProcess.on('close', code => {
            let log = `\nMAA 运行结束\n`
            this.runLog += log
            this.broadcast(Msg.LogInstance(log))
            complete()
        });
        // 异常推出
        childProcess.on('error', error => {
            let log = `\nMAA 异常结束 err ${error.message}\n`
            this.runLog += log
            this.broadcast(Msg.LogInstance(log))
            complete()
        });


    }


    buildMaaLogServer() {
        this.wss = new WebSocketServer({noServer: true})
        this.wss.on('connection', (ws) => {
        })
    }

    /**
     *
     * @param {Object} data
     */
    broadcast(data) {
        data = JSON.stringify(data)
        this.wss.clients.forEach(client => {
            try {
                client.send(data)
            } catch (e) {
                console.log('send err :=> ' + e.message)
            }
        })
    }


}


module.exports = MAA