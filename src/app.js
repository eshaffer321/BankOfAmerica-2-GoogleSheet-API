import {Balance} from "./balance";
import {Date} from "./date";
import {Transaction} from "./transaction";
import {Logger} from "./logger";
import {Income} from "./income";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const logger = new Logger();
const moment = require('moment');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/update-balance', async function (req, res) {

    logger.log({
        level: 'info',
        message: moment().format() + ' server.endpoint.post.update-balance ' + JSON.stringify(req.body)
    });

    let balance = new Balance();

    let result = await balance.updateAccountBalance(req.body);

    res.send(result);
});

app.get('/update-date', async function (req, res) {

    logger.log({
        level: 'info',
        message: moment().format() + ' server.endpoint.get.update-date'
    });

    let date = new Date();

    let results = await date.updateSheet();

    res.send(results);

});

app.get('/date', async function (req, res) {

    logger.log({
        level: 'info',
        message: moment().format() + ' server.endpoint.get.date'
    });

    res.send(moment().format('MM-YY'))
});

app.get('/categories', function (req, res) {

    logger.log({
        level: 'info',
        message: moment().format() + ' server.endpoint.get.categories'
    });

    let s = require('../static/ranges');
    let keys = [];
    for (let k in s) keys.push(k);

    res.send(keys)
});

app.get('/transaction', async function (req, res) {

    req.body = [{
        'merchant_name': 'BKOFAMERICA ATM WITHDRWL BLOSSOM HILL CA',
        'amount': '-20.00',
        'category': 'Uncategorized: Pending',
        'date': '07/12/2019',
        'description': 'BKOFAMERICA ATM 07/12 #000002721 WITHDRWL BLOSSOM HILL-WIN SAN JOSE CA',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'ONLINE BANKING PAYMENT TO CRD 9415',
        'amount': '-100.00',
        'category': 'Uncategorized: Pending',
        'date': '07/12/2019',
        'description': 'Online Banking payment to CRD 9415 Confirmation# 0294063325',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Counter Credit',
        'amount': '176.27',
        'category': 'Income: Deposits',
        'date': '07/12/2019',
        'description': 'activity type deposit',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Check',
        'amount': '-395.00',
        'category': 'Cash, Checks & Misc: Checks',
        'date': '07/10/2019',
        'description': 'activity type check',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Check',
        'amount': '-313.39',
        'category': 'Cash, Checks & Misc: Checks',
        'date': '07/09/2019',
        'description': 'activity type check',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Check',
        'amount': '-325.00',
        'category': 'Cash, Checks & Misc: Checks',
        'date': '07/08/2019',
        'description': 'activity type check',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'ONLINE BANKING PAYMENT TO CRD 9415',
        'amount': '-200.00',
        'category': 'Finance: Bank of America Credit Card Payment',
        'date': '07/08/2019',
        'description': 'Online Banking payment to CRD 9415 Confirmation# 4043160123',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'VENMO',
        'amount': '-59.00',
        'category': 'Cash, Checks & Misc: Other Expenses',
        'date': '07/08/2019',
        'description': 'VENMO 07/05 PURCHASE 855-812-4430 NY',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Counter Credit',
        'amount': '196.20',
        'category': 'Income: Deposits',
        'date': '07/08/2019',
        'description': 'activity type deposit',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Counter Credit',
        'amount': '106.25',
        'category': 'Income: Deposits',
        'date': '07/05/2019',
        'description': 'activity type deposit',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Counter Credit',
        'amount': '100.00',
        'category': 'Income: Deposits',
        'date': '07/03/2019',
        'description': 'activity type deposit',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'EDWARD JONES',
        'amount': '-200.00',
        'category': 'Savings & Transfers: Savings',
        'date': '07/01/2019',
        'description': 'EDWARD JONES DES:INVESTMENT ID:07218 721813321 INDN:BRITINEE DIONNE CO ID:XXXXX45811 PPD',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Check',
        'amount': '-325.00',
        'category': 'Cash, Checks & Misc: Checks',
        'date': '07/01/2019',
        'description': 'activity type check',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'ONLINE BANKING PAYMENT TO CRD 9415',
        'amount': '-600.00',
        'category': 'Finance: Bank of America Credit Card Payment',
        'date': '07/01/2019',
        'description': 'Online Banking payment to CRD 9415 Confirmation# 4082177612',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'VENMO',
        'amount': '-30.29',
        'category': 'Cash, Checks & Misc: Other Expenses',
        'date': '07/01/2019',
        'description': 'VENMO 06/28 PURCHASE 855-812-4430 NY',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Counter Credit',
        'amount': '40.00',
        'category': 'Income: Deposits',
        'date': '07/01/2019',
        'description': 'activity type deposit',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Counter Credit',
        'amount': '75.00',
        'category': 'Income: Deposits',
        'date': '07/01/2019',
        'description': 'activity type deposit',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Counter Credit',
        'amount': '121.56',
        'category': 'Income: Deposits',
        'date': '07/01/2019',
        'description': 'activity type deposit',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Counter Credit',
        'amount': '470.00',
        'category': 'Income: Deposits',
        'date': '07/01/2019',
        'description': 'activity type deposit',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Online payment from CHK 7',
        'amount': '-$100.00',
        'category': 'Finance: Bank of America Credit Card Payment',
        'date': '07/12/2019',
        'description': 'Online payment from CHK 7',
        'transaction_type': 'credit'
    }];

    logger.log({
        level: 'info',
        message: moment().format() + ' server.endpoint.post.transactions'
    });

    let transaction = new Transaction();

    let result = await transaction.updateTransactions(req.body);

    let income = new Income();

    await income.insertIncome(req.body);

    res.send(result);

});

app.post('/income', async function (req, res) {

    logger.log({
        level: 'info',
        message: moment().format() + ' server.endpoint.post.income'
    });

    let income = new Income();

    await income.insertIncome(req.body);

    res.send('Added income')
});

module.exports = app;
