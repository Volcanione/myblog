

//用户构造函数
module.exports = class Admin {
    constructor(info) {
        this.username = info.username
        this.email = info.email
        this.call = info.call
        this.password = '123456'
        this.createTime = +new Date()
        this.status = 1
        this.role = 1
    }
}