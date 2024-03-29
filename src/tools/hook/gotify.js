const {gotify} = require("gotify");
/**
 * @param {Hook} hook
 * @param {string} hookMessage
 */
const onGotifyHook = async (hook, hookMessage) => {
    try {
        await gotify({
            server: hook.url,
            app: hook.token,
            title: "MAA-Task-Completion",
            message: hookMessage,
            priority: 5,
        })
    } catch (e) {
        console.log('hook error :=>' + e.message)
    }

}


module.exports = onGotifyHook
