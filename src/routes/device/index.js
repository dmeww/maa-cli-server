const Router = require('express').Router
const cp = require('child_process')
const sharp = require('sharp')

const configTool = require('../../tools/config')
const file = require('../../tools/file')
const device = require('../../tools/device')

const deviceRouter = Router()
const {maa} = require('../maa')


deviceRouter.get('/screencap', async (req, res) => {
    const config = file.loadMaaConfig()
    try {
        const image = sharp(configTool.screenshotsPath())
        let quality = (maa.app && maa.app.quality) ? maa.app.quality > 10 ? maa.app.quality : 10 : 50
        const compressImage = await image.toFormat('jpeg').jpeg({quality: quality}).toBuffer()
        // 设置响应头
        res.set('Content-Type', 'image/jpeg')
        res.send(compressImage)
        cp.exec(`sh ${configTool.scripts.cap} ${config['connection']['device']} ${configTool.screenshotsPath()}`)
    } catch (err) {
        const image = sharp(configTool.screenshotsPath())
        res.send(image.toBuffer())
    }
})

deviceRouter.get('/power', (req, res) => {
    device.closeDevice()
    res.send('ok')
})


module.exports = deviceRouter
