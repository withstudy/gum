const { getAllActiveUser, file2Obj, init, log } = require('../utils')

exports.cmd = 'list'
exports.desc = 'Show you git email,name list'
exports.handler = () => {
    const userlist = init()
    const activeUsers = getAllActiveUser()
    userlist.forEach((item, index) => {
        const title = activeUsers.map((activeItem) => {
            if (activeItem.email === item.email && activeItem.name === item.name){
                return activeItem.type.slice(0,1)
            }
            return '-'
        })
        log(`-${title.join('')}\temail: ${item.email}, name: ${item.name}, alias: ${item.alias}`)
    })
}