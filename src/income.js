require('dotenv').config();
let jwtClient = require('../auth/auth');
const {google} = require('googleapis');
const sheets = google.sheets('v4');
let moment = require('moment');

module.exports = function(income) {
    module.insertSingleIncome = async function() {
        getIncomeCells(function(incomeCells) {
            let values = insert(income, incomeCells);
            let resource = {values};
            updateIncomeCells(resource, function(done) {});
        });
    };

    module.insertManyIncome = async function() {
        let income_list = [];

        getIncomeCells(function(incomeCells) {
            income.forEach(function(item) {
                if (item.category === 'Income') {
                    income_list.push(item);
                }
            });

            income_list.forEach(function(income) {
                insertPossibleDuplicate(incomeCells, income);
            });
        });
    };

    function insertPossibleDuplicate(incomeCells, income) {

        let unique = 1;
        incomeCells.forEach(function(row) {
            if (row[0] === income.date && row[3] === income.amount) {
                unique = 0;
            }
        });

        if (unique) {
            insert(income, incomeCells);
        }
    }

    function insert(income, incomeCellList) {
        let found = 0;
        incomeCellList.forEach(function(row) {
            if (row[0] === ' ' && row[1] === ' ' && row[2] === ' ' && row[3] === ' ' && !found) {
                row[0] = income.date;
                row[3] = income.amount;
                found = 1;
            }
        });
        return incomeCellList
    }

    function getIncomeCells(callback) {
        let moment = require('moment');
        let request = {
            spreadsheetId: process.env['SPREADSHEET_ID'],
            range: moment().format('MM-YY') + '!' + 'A21:D35',
            auth: jwtClient,
        };

        sheets.spreadsheets.values.get(request, function (err, response) {
            if (err) {
                console.error(err);
                return;
            }
            callback(response.data.values);
        });
    }

    function updateIncomeCells(resource, callback) {
        let params = {
            spreadsheetId: process.env['SPREADSHEET_ID'],
            range: moment().format('MM-YY') + '!' + 'A21:D35',
            valueInputOption: 'USER_ENTERED',
            auth: jwtClient,
            resource: resource
        };

        sheets.spreadsheets.values.update(params, function (err, response) {
            if (err) {
                console.error(err);
                return;
            }
            callback(response);
        });
    }

    return module;
};