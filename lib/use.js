const { use } = require('../utils')

exports.cmd = 'use'
exports.desc = 'Apply an item to git'
exports.builder = (yargs) => {
    return yargs
    .option('type', {
        alias: 't',
        describe: 'need use type , global or system or local',
        type: 'string',
        demandOption: true,
        group: 'use options:'
    })
    .option('alias', {
        alias: 'a',
        describe: 'use alias',
        type: 'string',
        demandOption: true,
        group: 'use options:'
    })
}
exports.handler = (argv) => {
    const alias = argv.alias
    const type = argv.type
    use(alias, type)
}