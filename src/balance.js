require('dotenv').config();
const jwtClient = require('../auth/auth.js');
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const currency = require('../static/currency');

function Balance() {}

Balance.prototype.updateAccountBalance = async function (account_list, sheet_name) {

    let request = {
        spreadsheetId: process.env['SPREADSHEET_ID'],
        range: sheet_name + '!A10:D15',
        auth: jwtClient,
    };

    sheets.spreadsheets.values.get(request, function (err, response) {
        if (err) {
            console.error(err);
            return;
        }

        let values = updateCellValues(response.data.values);

        const resource = {
            values,
        };

        let params = {
            spreadsheetId: process.env['SPREADSHEET_ID'],
            range: sheet_name + '!A10:D15',
            valueInputOption: 'USER_ENTERED',
            auth: jwtClient,
            resource: resource
        };

        sheets.spreadsheets.values.update(params, function (err, response) {
            if (err) {
                console.error(err);
                return;
            }
        });
    });

    function updateCellValues(updatedValues) {
        for (let i = 0; i < updatedValues.length; i++) {
            for (let j = 0; j < account_list.length; j++) {
                if (updatedValues[i][0] === account_list[j].name + '-' + account_list[j].account_name) {
                    updatedValues[i][3] = account_list[j].balance;
                    if (account_list[j].account_name === 'credit') {
                        updatedValues[i][3] = currency(updatedValues[i][3]).multiply(-1)
                    }
                }
            }
        }
        return updatedValues;
    }
};

Balance.prototype.updateRobinhoodBalance = async function() {};

let obj = new Balance();
module.exports = obj;
