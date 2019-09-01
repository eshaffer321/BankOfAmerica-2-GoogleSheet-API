import {Balance} from './balance';
import {Date} from './date';
import {Transaction} from './transaction';
import {Logger} from './logger';
import {Income} from './income';
import {Email} from './email';

const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const logger = new Logger();
const moment = require('moment');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/update-balance', async (req, res) => {
	logger.log({
		level: 'info',
		message: 'server.endpoint.post.update-balance ' + JSON.stringify(req.body)
	});

	const balance = new Balance();

	const result = await balance.updateAccountBalance(req.body);

	res.send(result);
});

app.get('/update-date', async (req, res) => {
	logger.log({
		level: 'info',
		message: 'server.endpoint.get.update-date'
	});

	const date = new Date();

	const results = await date.updateSheet();

	res.send(results);
});

app.get('/date', async (req, res) => {
	logger.log({
		level: 'info',
		message: 'server.endpoint.get.date'
	});

	res.send(moment().format('MM-YY'));
});

app.get('/categories', (req, res) => {
	logger.log({
		level: 'info',
		message: 'server.endpoint.get.categories'
	});

	const s = require('../static/ranges');
	const keys = [];
	for (const k in s) {
		keys.push(k);
	}

	res.send(keys);
});

app.post('/transaction', async (req, res) => {
	logger.log({
		level: 'info',
		message: 'server.endpoint.post.transactions'
	});

	const transaction = new Transaction();

	const income = new Income();

	const result = await transaction.updateTransactions(req.body);

	await income.insertIncome(req.body);

	res.send(result);
});

app.post('/income', async (req, res) => {
	logger.log({
		level: 'info',
		message: 'server.endpoint.post.income'
	});

	const income = new Income();

	await income.insertIncome(req.body);

	res.send('Added income');
});

module.exports = app;
