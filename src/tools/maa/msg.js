class Msg {

    /**
     *
     * @param {string} type
     * @param {Object} content
     */
    constructor(type, content) {
        this.type = type
        this.content = content
    }


    /**
     *
     * @param {Object} content
     * @return {Msg}
     * @constructor
     */
    static LogInstance(content) {
        return new Msg('log', content)
    }

    /**
     *
     * @param {Object} content
     * @return {Msg}
     * @constructor
     */
    static StatusInstance(content) {
        return new Msg('status', content)
    }


}


module.exports = Msg



