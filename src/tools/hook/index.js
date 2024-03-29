const onGotifyHook = require('./gotify')
const onConsoleHook = require('./console')
/**
 *
 * @param {Hook} hook
 * @param {string} hookMessage
 */
const onHook = async (hook, hookMessage) => {
    // 去掉运行阶段的日志,取出总结
    let index = hookMessage.indexOf("Summary")
    if (index !== -1) {
        hookMessage = hookMessage.substring(index, hookMessage.length - 1)
    }
    switch (hook.type) {
        case 'gotify': {
            await onGotifyHook(hook, hookMessage)
            break
        }
        default: {
            await onConsoleHook(hook, hookMessage)
        }
    }
}


class Hook {
    constructor() {
        this.type = 'console'
        this.url = ''
        this.token = ''
    }
}

module.exports = {
    onHook, Hook
}




















