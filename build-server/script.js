const { exec } = require('child_process')
const Path = require('path')
const fs = require('fs')
const mime = require('mime-types')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials:{

    }
})

const PROJECT_ID = process.env.PROJECT_ID || 'default-project-id'

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

    p.stdout.on('close', async  function(data) {
        console.log('build complete! ')
        const distFolderPath = Path.join(__dirname,'output', 'dist')
        const distFolderContents = fs.readdirSync(distFolderPath, { recuresive: true })

    for (const file of distFolderContents) {
        if(fs.lstatSync(filePath).isDirectory()) continue; {

            const command = new PutObjectCommand({
                Bucket: '',
                Key: `__output/${PROJECT_ID}/${filePath}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)

            })

            await s3Client.send(command)
        }

        console.log(`Uploaded ${filePath} to S3`)
    }        
    })

}

init()