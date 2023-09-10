const { del } = require('../utils')

exports.cmd = 'del'
exports.desc = 'Removes an item from the list'
exports.builder = (yargs) => {
    return yargs
        .option('alias', {
        alias: 'a',
        describe: 'need delete user alias',
        type: 'string',
        demandOption: true,
        group: 'del options:'
    })
}
exports.handler = (argv) => {
    del(argv.alias)
}