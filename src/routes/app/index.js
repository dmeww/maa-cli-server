const Router = require('express').Router
const {maa} = require('../maa')


const appRouter = Router()

appRouter.get('/config/get', (req, res) => {
    res.json(maa.app)
})

appRouter.post('/config/set', (req, res) => {
    maa.app = req.body
    res.json('保存成功')
})






module.exports = appRouter