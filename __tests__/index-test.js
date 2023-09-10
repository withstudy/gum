const { exec } = require('child_process')

test('gum init',() => {
    exec('node bin/cli.js version', (error, stdout, stderr) => {
        if(error){
            return
        }
        const { version, name } = require('../package.json')
        expect(stdout).toContain(`${name} version: ${version}`)
    })
})