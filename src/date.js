require('dotenv').config();
let moment = require('moment');
const jwtClient = require('../auth/auth.js');
const {google} = require('googleapis');
const sheets = google.sheets('v4');

function Date() {
    this.date = moment().format('MM-YY');
}

Date.prototype.getCurrentDate = function() {
    return this.data;
};

Date.prototype.getAllSheetNames = function (callback) {
    sheets.spreadsheets.get({
        auth: jwtClient,
        spreadsheetId: process.env['SPREADSHEET_ID'],
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err)
        }
        else {
            callback(response.data.sheets);
        }
    });
};

Date.prototype.copyFromTemplateToNewSheet = function (callback) {
    let request = {
        spreadsheetId: process.env['SPREADSHEET_ID'],

        sheetId: 759515713,

        resource: {
            destinationSpreadsheetId: process.env['SPREADSHEET_ID'],
        },

        auth: jwtClient,
    };

    sheets.spreadsheets.sheets.copyTo(request, function (err, response) {
        if (err) {
            console.error(err);
            return;
        }
        callback(response.data);
    });
};

Date.prototype.currentMonthSheetExists = function(sheetData) {
    let found = 0;
    let self = this;
    sheetData.forEach(function(sheet) {
        if (sheet.properties.title === self.date) {
            found = 1;
        }
    });
    return found;
};

Date.prototype.updateSheetName = function(sheetObj, callback) {
    let request = {
        spreadsheetId: process.env['SPREADSHEET_ID'],
        resource: {
            requests: [
                {
                    updateSheetProperties: {
                        properties: {
                            sheetId: sheetObj.sheetId,
                            title: this.date
                        },
                        fields: "title",
                    }
                }
            ],
        },
        auth: jwtClient,
    };

    sheets.spreadsheets.batchUpdate(request, function (err, response) {
        if (err) { console.error(err); }
        callback(response);
    });
};

let obj = new Date();

module.exports = obj;
