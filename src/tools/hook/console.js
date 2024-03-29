/**
 * @param {Hook} hook
 * @param {string} hookMessage
 */
const onConsoleHook =  (hook, hookMessage) => {
    return new Promise(resolve => {
        console.log(hookMessage)
        resolve()
    })
}


module.exports = onConsoleHook