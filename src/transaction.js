import {Google} from "./google";
import {Category} from "./category";

require('dotenv').config();

export class Transaction {

    constructor() {
        this.range = 'F1:BD24';
        this.className = 'transaction';
        this.googleSheetsApi = new Google();
    }

    async updateTransactions(transactionList) {

        let params = {
            range: this.range,
            className: this.className,
            methodName: 'updateTransactions'
        };

        let cells = await this.googleSheetsApi.get(params);

        let category = new Category();

        category.categorize(transactionList);

        this.appendColumn(transactionList);

        this.formatAmount(transactionList);

        this.insertTransactionsIntoCells(transactionList, cells);

        return await this.googleSheetsApi.update({req: params, data: cells})

    }

    appendColumn(transactionList) {

        let categoryMap = require('../static/ranges');

        transactionList.forEach(function (transaction) {

            if (categoryMap[transaction.category]) {
                transaction['columnNumber'] = categoryMap[transaction.category].column
            }

        });

    }

    formatAmount(transactionList) {

        transactionList.forEach(function (transaction) {

            transaction.amount.replace(',', '').replace('$', '');

            if (transaction.transaction_type === 'credit') {
                transaction.amount = transaction.amount.replace(',', '').replace('$', '');
            } else {
                transaction.amount = transaction.amount.toString().replace('-', '').replace(',', '').replace('$', '');
            }

            Math.abs(transaction.amount);

        });

    }

    insertTransactionsIntoCells(transactionList, cells) {

        let self = this;
        transactionList.forEach(function (transaction) {
            if (self.uniqueTransaction(transaction, cells)) {
                self.inputTransactionIntoRow(transaction, cells);
            }
        });

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

        return row[transaction.columnNumber] === transaction.date &&
            row[transaction.columnNumber + 1] === transaction.merchant_name &&
            parseFloat(row[transaction.columnNumber + 2]) === Math.abs(transaction.amount)

    }

    inputTransactionIntoRow(transaction, cells) {

        for (let i = 3; i < 20; i++) {
            if (
                cells[i][transaction.columnNumber] === ' ' &&
                cells[i][transaction.columnNumber + 1] === ' ' &&
                cells[i][transaction.columnNumber + 2] === ' '
            ) {
                cells[i][transaction.columnNumber] = transaction.date;
                cells[i][transaction.columnNumber + 1] = transaction.merchant_name;
                cells[i][transaction.columnNumber + 2] = transaction.amount;
                break;
            }
        }

    }

}
