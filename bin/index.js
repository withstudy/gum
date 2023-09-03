#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { execSync, exec } = require('child_process')
let userlist = []
const mode = 'dev'
const argStartIndex = mode === 'dev' ? 2 : 1

const operate = process.argv[argStartIndex]
const log = console.log
file2Obj()
const typeList = ['-l', '-g', '-s']
const typeMap = {
    '-l': '--local',
    '-g': '--global',
    '-s': '--system'
}
if (isHaveGit()) {
    switch (operate) {
        case 'init':
            {
                init()
            }
            break
        case 'list':
            {
                const activeUsers = getAllActiveUser()
                userlist.forEach((item, index) => {
                    const user = activeUsers.find((activeItem) => activeItem.email === item.email&& activeItem.user === item.user)
                    log(`---${user ? user.type.slice(0,1) : '-'}\temail: ${item.email}, name: ${item.name}`)
                })
            }
            break
        case 'add':
            {
                const email = process.argv[argStartIndex + 1]
                const name = process.argv[argStartIndex + 2]
                if (!email || !name) {
                    log('Error: Lost need parameter : add <email> <name>')
                    return
                }
                const is = userlist.find(u => u.email === email) 
                if(is){
                    log(`Error: ${email} Email already exist`)
                    return
                }
                userlist.push({
                    email,
                    name
                })
                obj2File()
                log('add success')
            }
            break
        case 'del':
            {
                const email = process.argv[argStartIndex + 1]
                if (!email) {
                    log('Error: Lost need parameter : del <email>')
                    return
                }
                userlist = userlist.filter(item => item.email !== email)
                obj2File()
                log('del success')
            }
            break
        case 'use':
            {
                let type = process.argv[argStartIndex + 1]
                let email
                if (type.startsWith('-') && !typeList.includes(type)) {
                    log('Error: type parameter not in [-l, -g, -s] : use [-l, -g, -s] <email>')
                    return
                }
                if (!type.startsWith('-')) {
                    email = type
                    type = '-l'
                } else[
                    email = process.argv[argStartIndex + 2]
                ]
                const user = userlist.find(item => item.email === email)
                if (!user) {
                    log('Error: user list not exist,you can use "xgum list" look user list')
                    return
                }
                const oldemail = getGitConfigEmail(typeMap[type])
                exec(`git config ${typeMap[type]} user.email ${user.email}`, (error, stdout, stderr) => {
                    if (!error) {
                        exec(`git config ${typeMap[type]} user.name ${user.name}`, (error, stdout, stderr) => {
                            if (!error) {
                                log('use success')
                                return
                            }
                            execSync(`git config ${typeMap[type]} user.email ${oldemail}`)
                            log('use error:', error)
                        })
                        return
                    }
                    log('use error:', error)
                })
            }
            break
        case 'help':
            log('xgum help: ')
            log('\t init: xgum init ')
            log('\t list: show git user list ')
            log('\t add <email> <name>: add new git user in list ')
            log('\t del <email>: delete git user in list ')
            log('\t use [-l, -g, -s] <email>: will git user set as this, -l is local, -g is global, -s is system, default -l ')
            break
        case 'version':
            const { version, name } = require('../package.json')
            log(`${name} version: ${version}`)
            break
        default:
            log('xgum unknown operate')
            break
    }
} else {
    log('Error: git not exist')
}

function file2Obj() {
    const file = fs.readFileSync(path.resolve(__dirname, 'userlist.json'), 'utf-8')
    userlist = JSON.parse(file)
}

function obj2File() {
    const file = JSON.stringify(userlist)
    fs.writeFileSync(path.resolve(__dirname, 'userlist.json'), file)
}

function init(){
    ['local', 'global', 'system'].map(type => initType(type))
    obj2File()
}

function initType(type) {
    try{
        const email = getGitConfigEmail(type)
        const name = getGitConfigName(type)
        userlist.findIndex(item => item.email === email) === -1 && email !== '' && userlist.push({ email, name })
    } catch (error) {}
}

function getAllActiveUser(){
    return ['local', 'global', 'system'].map(type => getActiveUser(type))
}

function getActiveUser(type) {
    let user = {
        type,
        email: '',
        name: ''
    }
    try{
        const email = getGitConfigEmail(type)
        const name = getGitConfigName(type)
        Object.assign(user, { email, name })
    } catch (error){

    }
    return user
}

function isHaveGit() {
    const res = execSync('git --version')
    return res.indexOf('version') > -1
}

function getGitConfigEmail(type){
    let email = ''
    try{
        email = execSync(`git config --${type} user.email`).toString().trim()
    } catch (error){

    }
    return email
}

function getGitConfigName(type){
    let email = ''
    try{
        email = execSync(`git config --${type} user.name`).toString().trim()
    } catch (error){

    }
    return email
}