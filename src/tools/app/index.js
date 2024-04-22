const {Hook} = require('../hook')
const file = require('../file')

class App {
    /**
     * 截屏图片质量
     * @type {number}
     */
    quality = 60

    /**
     *  任务执行回调通知
     * @type {Hook || null}
     */
    webHook = new Hook()

    constructor() {
        let config = file.loadAppConfig()
        this.quality = config['quality'] ? config['quality'] : 10
        this.webHook = config['webHook']
    }

    save(){
        file.saveMaaConfig(this)
    }

}


module.exports = App



















