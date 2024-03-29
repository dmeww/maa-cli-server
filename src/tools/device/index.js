const cp = require('child_process')
const configTool = require('../config')
const file = require('../file')


/**
 *
 * @param {string} device
 * @return {boolean}
 */
const getScreenStatus = (device) => {
    let log = cp.execSync(`sh ${configTool.scripts.screen} ${device}`)

    let result = log.toString().trim().split('=')
    if (result.length !== 2) return false
    return result[1] === 'true'
}


const openDevice = () => {
    const device = file.loadMaaConfig()['connection']['device']
    if (!getScreenStatus(device)) {
        cp.execSync(`adb -s ${device} shell input keyevent 26`)
    }
}

const closeDevice = () => {
    const device = file.loadMaaConfig()['connection']['device']
    cp.execSync(`adb -s ${device} shell input keyevent 26`)
}


module.exports = {
    openDevice,
    closeDevice
}
