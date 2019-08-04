import {Balance} from "./balance";
import {Date} from "./date";
import {Transaction} from "./transaction";
import {Logger} from "./logger";
import {Income} from "./income";
import {Email} from "./email";

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
        message: 'server.endpoint.post.update-balance ' + JSON.stringify(req.body)
    });

    let balance = new Balance();

    let result = await balance.updateAccountBalance(req.body);

    res.send(result);
});

app.get('/update-date', async function (req, res) {

    logger.log({
        level: 'info',
        message: 'server.endpoint.get.update-date'
    });

    let date = new Date();

    let results = await date.updateSheet();

    res.send(results);

});

app.get('/date', async function (req, res) {

    logger.log({
        level: 'info',
        message: 'server.endpoint.get.date'
    });

    res.send(moment().format('MM-YY'))
});

app.get('/categories', function (req, res) {

    logger.log({
        level: 'info',
        message: 'server.endpoint.get.categories'
    });

    let s = require('../static/ranges');
    let keys = [];
    for (let k in s) keys.push(k);

    res.send(keys)
});

app.post('/transaction', async function (req, res) {

    logger.log({
        level: 'info',
        message: 'server.endpoint.post.transactions'
    });

    let transaction = new Transaction();

    let income = new Income();

    let result = await transaction.updateTransactions(req.body);

    await income.insertIncome(req.body);

    res.send(result);

});

app.post('/income', async function (req, res) {

    logger.log({
        level: 'info',
        message: 'server.endpoint.post.income'
    });

    let income = new Income();

    await income.insertIncome(req.body);

    res.send('Added income')
});

module.exports = app;
