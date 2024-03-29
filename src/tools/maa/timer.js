const schedule = require('node-schedule')

class Timer {

    /**
     *
     * @param {string} cronExpression
     * @param {Function} cronFunc
     * @param {Task} task
     */
    constructor(cronExpression, task, cronFunc) {
        this.cronExpression = cronExpression;
        this.cronFunc = cronFunc
        this.task = task
        this.job = null
    }


    // 启动任务
    start() {
        // 如果当前没有正在运行的任务，则创建新的任务
        if (!this.job) {
            this.job = schedule.scheduleJob(this.cronExpression, this.cronFunc);
            console.log(`定时任务启动： ${this.cronExpression}`);
        }
    }

    // 停止任务
    stop() {
        // 如果当前有正在运行的任务，则取消任务并将 job 设为 null
        if (this.job) {
            this.job.cancel();
            console.log(`定时任务停止： ${this.cronExpression}`);
            this.job = null;
        }
    }


}

module.exports = Timer