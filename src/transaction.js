require('dotenv').config();
let jwtClient = require('../auth/auth');
const {google} = require('googleapis');
const sheets = google.sheets('v4');
let moment = require('moment');
let rules = require('../static/rules');
const logger = require('./logger');
const loggingMoment = require('moment');

/** Change the category based on the regex defined in rules.json */
async function updateCategoryFromFilePath(transactions) {
    transactions.forEach(function(rowEntry) {
                rules.forEach(function(rule) {
                    rowEntry.category = normalize(rowEntry, rule)
                });
            });

    return transactions
}

/** Helper function to update category */
function normalize(row, rule) {
    let regex = new RegExp(rule.expression);
    if (row.merchant_name === 'VENMO' && !row.is_updated_venmo) {
        if (row.amount > 0) {
            row.category = 'Income'
        } else {
            row['is_updated_venmo'] = 1;
            row.category = "Other";
        }
        row.amount = Math.abs(row.amount);
    } else {
        let result = regex.test(row[rule['properties_to_match'][0]]);
        if (result) { return rule.updated_values.category; }
    }

    return row.category
}

/** Checks ranges.json to see if there is a range defined in ranges.json */
function appendSpreadSheetRangeToTransactions(transactionsList) {
    let rangeMap = require('../static/ranges');
    transactionsList.forEach(function(entry) {
        entry['range'] = rangeMap[entry.category];
        if (rangeMap[entry.category]) {
            entry['range'] = rangeMap[entry.category].range
        }
    });
}

/** Call google sheets api with range from .env to get all transactions and category headers */
function getSpreadSheetTransactionArray(callback) {
    let moment = require('moment');
    let request = {
        spreadsheetId: process.env['SPREADSHEET_ID'],
        range: moment().format('MM-YY') + '!' + process.env['TRANSACTION_RANGE'],
        auth: jwtClient,
    };

    sheets.spreadsheets.values.get(request, function (err, response) {
        if (err) {
            logger.log({
                level: 'error',
                message: loggingMoment().format() + ' class.transaction.getSpreadSheetTransactionArray ' + err.errors[0].message
            });
            return;
        }
        callback(response.data.values)
    });
}

/** Find column number, then check if it has already been inserted. If not, insert into new available row. */
async function insertDataIntoSpreadSheet(transactionList) {
    getSpreadSheetTransactionArray(async function(transactionSpreadSheet) {

        // find the column number for each transaction
        transactionList.forEach(async function(transaction) {
            if (transaction.range) {
                if (transaction.transaction_type === 'credit' && typeof transaction.amount === 'string') {
                    transaction.amount = transaction.amount.replace(',', '').replace('$', '');
                } else {
                    transaction.amount = transaction.amount.toString().replace('-', '').replace(',', '').replace('$', '');
                    transaction.amount = Math.abs(transaction.amount);
                }

                findColumnNumberForTransaction(transactionSpreadSheet,transaction);
            } else {
            }
        });

        // determine if this transaction has already been entered
        transactionList.forEach(async function(transaction) {
            if (transaction.range && transaction.column) {
              if(!transactionAlreadyExistsInSheet(transactionSpreadSheet, transaction)) {
                  insertTransactionEntry(transactionSpreadSheet, transaction);
              }
            }
        });
        await insertIntoGoogleSheets(transactionSpreadSheet);
    });

}

/** Take the finished updated sheet object and post to sheets api */
async function insertIntoGoogleSheets(transactionSpreadSheet) {
    let moment = require('moment');

    let values = transactionSpreadSheet;
    const resource = {
        values,
    };

    let params = {
        spreadsheetId: process.env['SPREADSHEET_ID'],
        range: moment().format('MM-YY') + '!' + process.env['TRANSACTION_RANGE'],
        valueInputOption: 'USER_ENTERED',
        auth: jwtClient,
        resource: resource
    };

    sheets.spreadsheets.values.update(params, function (err, response) {
        if (err) {
            logger.log({
                level: 'error',
                message: loggingMoment().format() + ' class.transaction.insertIntoGoogleSheets ' + err.errors[0].message
            });
            return;
        }
        console.log('Updated cells post to google api');
    });
}

/** Finds the column number based on the sheets object */
function findColumnNumberForTransaction(spreadSheet, transaction) {
    for(let i = 0; i < spreadSheet[0].length; i++) {
        if (spreadSheet[0][i] !== '' && transaction.category === spreadSheet[0][i]) {
            transaction['column'] = i;
        }
    }

}

/** Find an empty row and insert the transaction */
function insertTransactionEntry(transactionSpreadSheet, transaction) {
    if (moment(transaction.date, "MM-DD-YYYY").format('MM-YY') !== moment().format('MM-YY')) {return}
    for (let i = 3; i < 20; i++) {
        if (
            transactionSpreadSheet[i][transaction.column] === ' ' &&
            transactionSpreadSheet[i][transaction.column + 1] === ' ' &&
            transactionSpreadSheet[i][transaction.column + 2] === ' '
        ) {
            transactionSpreadSheet[i][transaction.column] = transaction.date;
            transactionSpreadSheet[i][transaction.column + 1] = transaction.merchant_name;
            transactionSpreadSheet[i][transaction.column + 2] = transaction.amount;
            break;
        }
    }
}

/** Loop through all rows and compare to see if entered already */
function transactionAlreadyExistsInSheet(transactionSpreadSheet, transaction) {
    for (let i = 3; i < 20; i++) {
        if (compare(transactionSpreadSheet[i], transaction)) { return true; }
    }
    return false;
}

/** Compare name, date, and amount to see if this transaction already exists */
function compare(row, transaction) {

    if (row && row.length >= transaction.column + 3) {
        if (row[transaction.column +2] !== ' ' && transaction.transaction_type === 'checking') {
            row[transaction.column + 2] = parseFloat(row[transaction.column + 2])
        }
        return row[transaction.column] === transaction.date &&
            row[transaction.column + 1] === transaction.merchant_name &&
            row[transaction.column + 2] === transaction.amount
    }
    return false;
}

module.exports = function(transactions) {
    module.start = async function(){
        let data = await updateCategoryFromFilePath(transactions);
        let income = require('./income')(data);
        income.insertManyIncome();
        appendSpreadSheetRangeToTransactions(data);
        await insertDataIntoSpreadSheet(data);
    };

    return module;
};
