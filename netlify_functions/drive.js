const { google } = require('googleapis')
const JSZip = require('jszip')

const GOOGLE_JSON = JSON.parse(process.env.GOOGLE_DRIVE_JSON)
const FOLDER_ID = '1oRsAXm-gCwDWFefxOkTc8eOLpx8RzIZG'

async function sendFile(buf2) {
  const client = await google.auth.getClient({
    credentials: GOOGLE_JSON,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  })
  // send to drive
  const drive = google.drive({ version: 'v3', auth: client })

  await drive.files.create({
    requestBody: {
      name: `foo.zip`,
      mimeType: 'application/zip',
      parents: [FOLDER_ID],
    },
    media: {
      mimeType: 'application/zip',
      body: buf2,
    },
  })
}

exports.handler = function (event, context, callback) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  console.log('Sending to drive')
  const data_in = JSON.parse(event.body)
  let zip = new JSZip()

  zip.file('data.json', JSON.stringify(data_in['data']))
  zip.file('log.json', JSON.stringify(data_in['logs']))

  let ns = zip.generateNodeStream({
    streamFiles: true,
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6,
    },
  })
  sendFile(ns)
    .then(() => {
      callback(null, {
        statusCode: 200,
      })
    })
    .catch((e) => {
      callback(e)
    })
}
