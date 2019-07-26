let {google} = require('googleapis');

let jwtClient = new google.auth.JWT(
    process.env['CLIENT_EMAIL'],
    null,
    process.env['PRIVATE_KEY']
    ['https://www.googleapis.com/auth/spreadsheets']
);

let regex = new RegExp('\\\\n', "g");

jwtClient.key = process.env['PRIVATE_KEY'].replace(regex, '\n');
jwtClient.scopes = ['https://www.googleapis.com/auth/spreadsheets'];

module.exports = jwtClient;
