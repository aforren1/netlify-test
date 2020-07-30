
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });

const MAILGUN_URL = "https://api.mailgun.net/v3/" + MAILGUN_DOMAIN;

exports.handler = function (event, context, callback) {
    callback(null, {
        statusCode: 200,
        body: MAILGUN_DOMAIN,
    })
}
