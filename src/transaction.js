import {Google} from './google';
import {Category} from './category';
import {Email} from './email';
import {Logger} from './logger';

export class Transaction {
	constructor() {
		this.range = 'F1:BD24';
		this.className = 'transaction';
		this.googleSheetsApi = new Google();
		this.logger = new Logger();
	}

	async updateTransactions(transactionList) {
		try {
			const params = {
				range: this.range,
				className: this.className,
				methodName: 'updateTransactions'
			};

			const cells = await this.googleSheetsApi.get(params);

			const category = new Category();

			category.categorize(transactionList);

			this.appendColumn(transactionList);

			this.formatAmount(transactionList);

			const transactionLog = this.insertTransactionsIntoCells(transactionList, cells);

			await this.googleSheetsApi.update({req: params, data: cells});

			await new Email({
				subject: 'Transaction Log',
				html: this.generateTransactionLogHTML(transactionLog)
			}).send();

			this.logger.log({
				level: 'info',
				message: transactionLog
			});

			return transactionLog;
		} catch (error) {
			this.logger.log({
				level: 'error',
				message: error.toString()
			});
			new Email({
				subject: 'Transaction Error',
				html: error.toString()
			}).send();
		}
	}

	generateTransactionLogHTML(transactionLog) {
		let table = '<table style=\'width:100%\'>' +
               '<tr>' +
                 '<th>Date</th>' +
                 '<th>Merchant</th>' +
                 '<th>Amount</th>' +
                 '<th>Open Cell</th>' +
               '</tr>';

		transactionLog.forEach(item => {
			table = table +
                '<tr>' +
                '<td>' + item.date + '</td>' +
                '<td>' + item.merchantName + '</td>' +
                '<td>' + item.amount + '</td>' +
                '<td>' + item.openCell + '</td>' +
                '</tr>';
		});

		return table + '</table>';
	}

	appendColumn(transactionList) {
		const categoryMap = require('../static/ranges');

		transactionList.forEach(transaction => {
			if (categoryMap[transaction.category]) {
				transaction.columnNumber = categoryMap[transaction.category].column;
			}
		});
	}

	formatAmount(transactionList) {
		transactionList.forEach(transaction => {
			transaction.amount.replace(',', '').replace('$', '');

			if (transaction.transactionType === 'credit') {
				transaction.amount = transaction.amount.replace(',', '').replace('$', '');
			} else {
				transaction.amount = transaction.amount.toString().replace('-', '').replace(',', '').replace('$', '');
			}

			Math.abs(transaction.amount);
		});
	}

	insertTransactionsIntoCells(transactionList, cells) {
		const self = this;
		const transactionLogList = [];
		transactionList.forEach(transaction => {
			if (self.uniqueTransaction(transaction, cells) && transaction.columnNumber) {
				transactionLogList.push(self.inputTransactionIntoRow(transaction, cells));
			}
		});
		return transactionLogList;
	}

	uniqueTransaction(transaction, cells) {
		for (let i = 3; i < 20; i++) {
			if (this.compare(cells[i], transaction)) {
				return false;
			}
		}

		return true;
	}

	compare(row, transaction) {
		return transaction.columnNumber &&
            row[transaction.columnNumber] === transaction.date &&
            row[transaction.columnNumber + 1] === transaction.merchantName &&
            parseFloat(row[transaction.columnNumber + 2]) === Math.abs(transaction.amount);
	}

	inputTransactionIntoRow(transaction, cells) {
		const newTransactionLogItem = {
			openCell: false
		};

		for (let i = 3; i < 20; i++) {
			if (
				cells[i][transaction.columnNumber] === ' ' &&
                cells[i][transaction.columnNumber + 1] === ' ' &&
                cells[i][transaction.columnNumber + 2] === ' '
			) {
				cells[i][transaction.columnNumber] = transaction.date;
				cells[i][transaction.columnNumber + 1] = transaction.merchantName;
				cells[i][transaction.columnNumber + 2] = transaction.amount;

				newTransactionLogItem.openCell = true;
				newTransactionLogItem.date = transaction.date;
				newTransactionLogItem.merchantName = transaction.merchantName;
				newTransactionLogItem.amount = transaction.amount;

				break;
			}
		}

		return newTransactionLogItem;
	}
}
