const Router = require('express').Router
const MAA = require('../../tools/maa')
const uuid = require('uuid')
const file = require("../../tools/file");

const maaRouter = Router()
let maa = new MAA()

maaRouter.get('/config/get', (req, res) => {
    res.json(file.loadMaaConfig())
})

maaRouter.post('/config/set', (req, res) => {
    let config = req.body
    if (config === null) res.send('sent config is null')
    let result = file.saveMaaConfig(config)
    res.send(result ? 'success' : 'failed')
})

maaRouter.get('/status', (req, res) => {
    maa.status.len = maa.taskQueue.length
    res.json(maa.status)
})

maaRouter.post('/task/add', (req, res) => {
    let task = req.body
    task.uuid = uuid.v4()

    maa.addTask(task)
    res.status(200).json(task)
})

maaRouter.get('/task/stop', (req, res) => {
    let result = maa.stopCurrentTask()
    res.send(result ? 'success' : 'failed')
})

maaRouter.post('/task/timer/add', (req, res) => {
    let task = req.body
    task.uuid = uuid.v4()
    let time = task['time']
    if (!time) {
        res.send("没有指定任务时间")
    }
    let hour = time.split(':')[0]
    let minute = time.split(':')[1]

    if (!hour || !minute) res.send('时间格式错误,example: 12:30')

    maa.addTimerTask(task, hour, minute)
    res.status(200).json(task)
})

maaRouter.get('/task/timer/list', (req, res) => {
    let timerTaskList = []
    maa.timerMap.forEach((timer, taskUUID) => {
        timerTaskList.push(timer.task)
    })
    timerTaskList.sort((timer1, timer2) => {
        return timer1.time.localeCompare(timer2.time)
    })
    res.json(timerTaskList)
})

maaRouter.post('/task/timer/remove', (req, res) => {
    let data = req.body
    let result = maa.removeTimerTask(data.uuid)
    res.send(result ? 'success' : 'failed')
})



module.exports = {
    maaRouter,
    maa
}