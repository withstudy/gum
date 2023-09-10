const fs = require('fs')
const path = require('path')
const { execSync, exec } = require('child_process')
let userlist
const types = ['global', 'system', 'local']

function getActiveUser(type) {
    let user = {
        type,
        email: '',
        name: ''
    }
    try {
        const email = getGitConfigEmail(type)
        const name = getGitConfigName(type)
        Object.assign(user, { email, name })
    } catch (error) {

    }
    return user
}

function getGitConfigEmail(type) {
    let email = ''
    try {
        email = execSync(`git config --${type} user.email`).toString().trim()
    } catch (error) {
    }
    return email
}

function getGitConfigName(type) {
    let email = ''
    try {
        email = execSync(`git config --${type} user.name`).toString().trim()
    } catch (error) {

    }
    return email
}

function getAllActiveUser() {
    return types.map(type => getActiveUser(type))
}

function file2Obj() {
    const file = fs.readFileSync(path.resolve(__dirname, 'userlist.json'), 'utf-8')
    userlist = JSON.parse(file)
}

function obj2File() {
    const file = JSON.stringify(userlist)
    fs.writeFileSync(path.resolve(__dirname, 'userlist.json'), file)
}

function init() {
    file2Obj()
    types.map(type => initType(type))
    obj2File()
    return userlist
}

function initType(type) {
    try {
        const email = getGitConfigEmail(type)
        const name = getGitConfigName(type)
        userlist.findIndex(item => item.email === email) === -1 && email !== '' && userlist.push({ email, name, alias: name })
    } catch (error) { }
}

function add(email, name, alias) {
    file2Obj()
    const index = userlist.findIndex(item => item.alias === alias)
    if(index !== -1){
        return log('Error: This alias has been ruined')
    }
    userlist.push({
        email,
        name,
        alias
    })
    obj2File()

    log('add success')
}

function del(alias) {
    file2Obj()
    userlist = userlist.filter(item => item.alias !== alias)
    obj2File()
    log('del success')
}

const log = console.log

function use(alias, type) {
    if(!types.includes(type)){
        log(`Error: type must be ${types.join(',')}`)
    }
    file2Obj()
    const user = userlist.find(item => item.alias === alias)
    if (!user) {
        log('Error: Alias does not exist,You can use "xgum list" look list')
        return
    }
    const oldemail = getGitConfigEmail(type)
    exec(`git config --${type} user.email ${user.email}`, (error, stdout, stderr) => {
        if (!error) {
            exec(`git config --${type} user.name ${user.name}`, (error, stdout, stderr) => {
                if (!error) {
                    log('use success')
                    return
                }
                execSync(`git config --${type} user.email ${oldemail}`)
                log('use error:', error)
            })
            return
        }
        log('use error:', error)
    })
}



exports.getActiveUser = getActiveUser
exports.getAllActiveUser = getAllActiveUser
exports.file2Obj = file2Obj
exports.obj2File = obj2File
exports.init = init
exports.log = log
exports.add = add
exports.del = del
exports.use = use