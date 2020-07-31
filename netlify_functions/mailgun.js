
const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });
const JSZip = require('jszip');


function sendMailgun(buf2, callback) {
    let buf = new Buffer.from(buf2);

    var attach = new mailgun.Attachment({
        data: buf, filename: 'data.zip',
        contentType: 'application/zip',
        knownLength: buf.length
    });

    let data = {
        from: "Alex 'Mailgun' Forrence <mailgun@" + DOMAIN + ">",
        to: "actlab@yale.edu",
        subject: "Coming to you live from a webpage",
        text: "see attached",
        attachment: attach
    };

    mailgun.messages().send(data, function (error, body) {
        if (error) {
            callback(null, {
                statusCode: error.statusCode
            })
        } else {
            callback(null, {
                statusCode: 200
            })
        }
    });
}

exports.handler = function (event, context, callback) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' }
    }
    const data_in = JSON.parse(event.body);
    let zip = new JSZip();

    zip.file("data.json", JSON.stringify(data_in['data']));
    zip.file("log.json", JSON.stringify(data_in['logs']));

    console.log('Sending email.');
    let sf = (v) => sendMailgun(v, callback);
    zip.generateAsync({
        type: 'arraybuffer',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 6
        }
    }).then(sf);
}
