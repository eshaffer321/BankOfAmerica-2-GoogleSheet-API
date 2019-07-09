let {google} = require('googleapis');
let private_key = require("./private.json");

let jwtClient = new google.auth.JWT(
    private_key.client_email,
    null,
    private_key.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

module.exports = jwtClient;
