const { exec } = require('child_process')
const Path = require('path')

async function init() {
    console.log('Executing Script.js')
    const outDirPath = Path.join(__dirname, 'output')

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', function(data) {
        console.log(data.toString())
    })

    p.stdout.on('error', function(data) {
        console.log('Error', data.toString())
    })

    p.stdout.on('close', function(data) {
        console.log('build complete! ')
    })
}