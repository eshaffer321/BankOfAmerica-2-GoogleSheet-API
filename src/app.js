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
        'merchant_name': 'BANK OF AMERICA',
        'amount': '-196.45',
        'category': 'Finance: Bank of America Credit Card Payment',
        'date': '07/11/2019',
        'description': 'Bank of America Credit Card Bill Payment',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'BANK OF AMERICA',
        'amount': '-196.45',
        'category': 'Finance: Bank of America Credit Card Payment',
        'date': '07/08/2019',
        'description': 'Bank of America Credit Card Bill Payment',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'Check',
        'amount': '-3,495.00',
        'category': 'Cash, Checks & Misc: Checks',
        'date': '07/05/2019',
        'description': 'activity type check',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'PACIFIC GAS AND ELECTRIC',
        'amount': '-41.60',
        'category': 'Home & Utilities: Utilities',
        'date': '07/02/2019',
        'description': 'PGANDE DES:WEB ONLINE ID:XXXXX811063019 INDN:ERICK SHAFFER CO ID:XXXXX42640 WEB',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'FEDLOAN SERVICING',
        'amount': '-4,957.54',
        'category': 'Education: Education',
        'date': '07/02/2019',
        'description': 'FEDLOANSERVICING DES:STDNT LOAN ID:6NCF2VCSKB1 INDN:ERICK SHAFFER CO ID:XXXXX00802 WEB',
        'transaction_type': 'checking'
    }, {
        'merchant_name': 'COMCAST',
        'amount': '$69.16',
        'category': 'Home & Utilities: Cable/Satellite Services',
        'date': '07/12/2019',
        'description': 'COMCAST CALIFORNIA 800-COMCAST CA',
        'transaction_type': 'credit'
    }, {
        'merchant_name': 'SPICE KIT SAN FRANCISCO',
        'amount': '$14.81',
        'category': 'Restaurants & Dining: Restaurants/Dining',
        'date': '07/12/2019',
        'description': 'SPICE KIT SAN FRANCISCO SAN FRANCISCOCA',
        'transaction_type': 'credit'
    }, {
        'merchant_name': 'PAYMENT - THANK YOU',
        'amount': '-$196.45',
        'category': 'Finance: Bank of America Credit Card Payment',
        'date': '07/11/2019',
        'description': 'PAYMENT - THANK YOU',
        'transaction_type': 'credit'
    }, {
        'merchant_name': 'RIDGE VINEYARDS - MONTEB',
        'amount': '$30.00',
        'category': 'Groceries: Groceries',
        'date': '07/09/2019',
        'description': 'RIDGE VINEYARDS - MONTEBCUPERTINO CA',
        'transaction_type': 'credit'
    }, {
        'merchant_name': 'Audible US*MH2BQ60Y2',
        'amount': '$14.95',
        'category': 'Shopping & Entertainment: General Merchandise',
        'date': '07/08/2019',
        'description': 'Audible US*MH2BQ60Y2 888-283-5051 NJ',
        'transaction_type': 'credit'
    }, {
        'merchant_name': 'PAYMENT - THANK YOU',
        'amount': '-$196.45',
        'category': 'Finance: Bank of America Credit Card Payment',
        'date': '07/06/2019',
        'description': 'PAYMENT - THANK YOU',
        'transaction_type': 'credit'
    }, {
        'merchant_name': 'PIZZERIA VENTI',
        'amount': '$122.25',
        'category': 'Restaurants & Dining: Restaurants/Dining',
        'date': '07/06/2019',
        'description': 'PIZZERIA VENTI MOUNTAIN VIEWCA',
        'transaction_type': 'credit'
    }];

    logger.log({
        level: 'info',
        message: moment().format() + ' server.endpoint.post.transactions'
    });

    let transaction = new Transaction();

    let result = await transaction.updateTransactions(req.body);

    let income = new Income();

    await income.insertIncome(result);

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
