const appPath = () => {
    return __filename.substring(0, __filename.length - "/src/tools/config/index.js".length)
}

const scriptsPath = () => {
    return `${appPath()}/scripts`
}

const screenshotsPath = ()=>{
    return  `${appPath()}/screenshots/screen.png`
}

const configPath = ()=>{
    return `${appPath()}/config.json`
}

const scripts = {
    maa: `${scriptsPath()}/maa.sh`,
    screen: `${scriptsPath()}/screen.sh`,
    cap: `${scriptsPath()}/cap.sh`
}

const maaPath = () => {
    return '/root/.config/maa'
}

module.exports = {
    appPath,
    maaPath,
    screenshotsPath,
    configPath,
    scripts,
}