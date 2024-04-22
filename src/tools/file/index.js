const fs = require('fs')
const configTool = require('../config')
const getMaaConfigPath = () => {
    return `${configTool.maaPath()}/asst.json`
}

const getMaaTaskFile = (taskName) => {
    return `${configTool.maaPath()}/tasks/${taskName}.json`
}

/**
 * @returns {object} 返回一个对象
 */
const loadMaaConfig = () => {
    try {
        let resStr = fs.readFileSync(getMaaConfigPath(), 'utf8')
        return JSON.parse(resStr)
    } catch (e) {
        console.log('读取MAA配置失败 :=> ' + e.message)
        return {}
    }
}

/**
 * @param {Object} config
 * @return boolean
 */
const saveMaaConfig = (config) => {
    try {
        fs.writeFileSync(getMaaConfigPath(), JSON.stringify(config), 'utf8')
    } catch (e) {
        console.log('写入App配置失败 :=> ' + e.message)
        return false
    }
    return true
}

/**
 *
 * @param {Task} task
 * @return {boolean}
 */
const saveMaaTask = (task) => {
    try {
        fs.writeFileSync(getMaaTaskFile(task.uuid), JSON.stringify(task.content), 'utf8')
    } catch (e) {
        console.log(e)
        return false
    }
    return true
}

/**
 *
 * @param {string} taskUUID
 * @return {boolean}
 */
const removeMaaTask = (taskUUID) => {
    try {
        fs.unlinkSync(getMaaTaskFile(taskUUID))
    } catch (e) {
        console.log(e)
        return false
    }
    return true
}

const loadAppConfig = () => {
    try {
        let resStr = fs.readFileSync(configTool.configPath(), 'utf8')
        return JSON.parse(resStr)
    } catch (e) {
        console.log('读取MAA配置失败 :=> ' + e.message)
        return {}
    }
}

/**
 *
 * @param {App} config
 * @return {boolean}
 */
const saveAppConfig = (config) => {
    try {
        fs.writeFileSync(configTool.configPath(), JSON.stringify(config), 'utf8')
    } catch (e) {
        console.log('写入MAA配置失败 :=> ' + e.message)
        return false
    }
    return true
}

/**
 * 
 * @returns {Task[]}
 */
const loadTimerTasks = () => {
    try {
        let resStr = fs.readFileSync(`${configTool.appPath()}/tasks.json`, 'utf8')
        return JSON.parse(resStr)
    } catch (e) {
        console.log('读取定时任务配置失败 :=> ' + e.message)
        return []
    }
}

const saveTimerTasks = (tasks = []) => {
    try {
        if (tasks.length)
            fs.writeFileSync(`${configTool.appPath()}/tasks.json`, JSON.stringify(tasks), 'utf8')
        else
            fs.writeFileSync(`${configTool.appPath()}/tasks.json`, '[]', 'utf8')
    } catch (e) {
        console.log('写入定时任务配置失败 :=> ' + e.message)
        return false
    }
    return true
}


module.exports = {
    loadMaaConfig,
    saveMaaConfig,
    saveMaaTask,
    removeMaaTask,
    loadAppConfig,
    saveAppConfig,
    loadTimerTasks,
    saveTimerTasks
}
