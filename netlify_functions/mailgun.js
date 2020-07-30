
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });

const MAILGUN_URL = "https://api.mailgun.net/v3/" + MAILGUN_DOMAIN;


exports.handler = function (event, context, callback) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' }
    }
    //const data = JSON.parse(event.body)
    console.log('Sending email.')

    let data = {
        from: "Alex 'Mailgun' Forrence <mailgun@" + MAILGUN_DOMAIN + ">",
        to: "actlab@yale.edu",
        subject: "Coming to you live from a webpage",
        text: JSON.parse(event.body)
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
    })

}
