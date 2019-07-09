const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded());

const balanceUpdater = require('./balance');
const dateUpdate = require('./date');

let temp = [];


app.post('/update-balance', async function (req, res) {
    let moment = require('moment');
    await balanceUpdater.updateAccountBalance(req.body, moment().format('MM-YY'));
    res.send('updated balance')
});

app.get('/update-date', async function (req, res) {
    let message = {};
    dateUpdate.getAllSheetNames(function (sheetList) {
        if (!dateUpdate.currentMonthSheetExists(sheetList)) {
            message['current_date_sheet_exists'] = "false";
            dateUpdate.copyFromTemplateToNewSheet(function (newSheetFromTemplate) {
                dateUpdate.updateSheetName(newSheetFromTemplate, function (done) {
                    message['end'] = done;
                    message['created_sheet'] = "true";
                    res.send(message);
                });
            });
        } else {
            message['created_sheet'] = "false";
            res.send(message);
        }

    });

});

app.get('/date', async function (req, res) {
    let moment = require('moment');
    res.send(moment().format('MM-YY'))
});

app.get('/categories', function (req, res) {
    let s = require('../static/ranges');
    let keys = [];
    for (let k in s) keys.push(k);
    res.send(keys)
});

app.post('/transactions', async function (req, res) {
    console.log('Request to /transactions');
    let transactions = [];
    req.body.forEach(async function (account_transaction) {
        if (account_transaction.length > 0) {
            account_transaction.forEach(function (row) {
                transactions.push(row);
            });
        }
    });
    let transaction = require('./transaction')(transactions);
    await transaction.start();
    res.send('updated transactions')
});

app.get('/transactions', async function (req, res) {
    console.log('GET REQUEST - /transactions')
    req.body = temp;

    let transactions = [];

    req.body.forEach(async function (account_transaction) {
        if (account_transaction.length > 0) {
            account_transaction.forEach(function (row) {
                transactions.push(row);
            });
        }
    });

    let transaction = require('./transaction')(transactions);
    await transaction.start();
    res.send('updated transactions')
});

app.get('/income', async function (req, res) {

    let income = {
        amount: '22.00',
        date: '05/21/2019'
    };

    let incomeModule = require('./income')(income);
    await incomeModule.insertSingleIncome()

    res.send('Added income')
});

app.post('/expense', async function (req, res) {
    let transaction = require('./transaction')(req.body);
    transaction.start();
    res.send('Added expense');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
