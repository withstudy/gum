const { add } = require('../utils')

exports.cmd = 'add'
exports.desc = 'Add an item to the list'
exports.builder = (yargs) => {
    return yargs
        .option('email', {
            alias: 'e',
            describe: 'user email',
            type: 'string',
            demandOption: true,
            group: 'add options:'
        }).option('name', {
            alias: 'n',
            describe: 'user name',
            type: 'string',
            demandOption: true,
            group: 'add options:'
        }).option('alias', {
            alias: 'a',
            describe: 'user alias',
            type: 'string',
            demandOption: true,
            group: 'add options:'
        })
}
exports.handler = (argv) => {
    const email = argv.email
    const name = argv.name
    const alias = argv.alias
    add(email, name, alias)
}