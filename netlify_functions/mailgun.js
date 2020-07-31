
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });
const JSZip = require('jszip');


function sendFile(buf2, callback) {
    let buf = new Buffer.from(buf2);

    var attach = new mailgun.Attachment({
        data: buf, filename: 'data.zip',
        contentType: 'application/zip',
        knownLength: buf.length
    });

    let data = {
        from: "Alex 'Mailgun' Forrence <mailgun@" + MAILGUN_DOMAIN + ">",
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

    console.log('Sending email. ' + event.body);
    const data_in = JSON.parse(event.body);
    let zip = new JSZip();

    zip.file("data.json", JSON.stringify(data_in['data']));
    zip.file("log.json", JSON.stringify(data_in['logs']));

    let sf = (v) => sendFile(v, callback);
    zip.generateAsync({type: 'arraybuffer'}).then(sf);
}
