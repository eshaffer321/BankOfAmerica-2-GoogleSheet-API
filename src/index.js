require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env['PORT'];
app.use(express.json());
app.use(express.urlencoded());

const balanceUpdater = require('./balance');
const dateUpdate = require('./date');
const logger = require('./logger');
const loggingMoment = require('moment');

let temp = [];

app.post('/update-balance', async function (req, res) {
    logger.log({
        level: 'info',
        message: loggingMoment().format() + ' server.endpoint.post.update-balance ' + JSON.stringify(req,body)
    });

    let moment = require('moment');
    await balanceUpdater.updateAccountBalance(req.body, moment().format('MM-YY'));
    res.send('updated balance')
});

app.get('/update-date', async function (req, res) {
    logger.log({
        level: 'info',
        message: loggingMoment().format() + ' server.endpoint.get.update-date'
    });

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
    logger.log({
        level: 'info',
        message: loggingMoment().format() + ' server.endpoint.get.date'
    });
    let moment = require('moment');
    res.send(moment().format('MM-YY'))
});

app.get('/categories', function (req, res) {
    logger.log({
        level: 'info',
        message: loggingMoment().format() + ' server.endpoint.get.categories'
    });
    let s = require('../static/ranges');
    let keys = [];
    for (let k in s) keys.push(k);
    res.send(keys)
});

app.post('/transactions', async function (req, res) {
    logger.log({
        level: 'info',
        message: loggingMoment().format() + ' server.endpoint.post.transactions'
    });

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

// app.get('/transactions', async function (req, res) {
//     console.log('GET REQUEST - /transactions')
//     req.body = temp;
//
//     let transactions = [];
//
//     req.body.forEach(async function (account_transaction) {
//         if (account_transaction.length > 0) {
//             account_transaction.forEach(function (row) {
//                 transactions.push(row);
//             });
//         }
//     });
//
//     let transaction = require('./transaction')(transactions);
//     await transaction.start();
//     res.send('updated transactions')
// });

app.get('/test', async function (req, res) {
    dateUpdate.willFail();
    res.send('updated transactions')
});

app.post('/income', async function (req, res) {
    logger.log({
        level: 'info',
        message: loggingMoment().format() + ' server.endpoint.post.income'
    });

    let income = {
        amount: '22.00',
        date: '05/21/2019'
    };

    let incomeModule = require('./income')(income);
    await incomeModule.insertSingleIncome();

    res.send('Added income')
});

app.post('/expense', async function (req, res) {
    logger.log({
        level: 'info',
        message: loggingMoment().format() + ' server.endpoint.post.expense ' + JSON.stringify(req.body)
    });
    let transaction = require('./transaction')(req.body);
    transaction.start();
    res.send('Added expense');
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
