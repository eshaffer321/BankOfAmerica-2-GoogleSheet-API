import {Google} from "./google";
import {Category} from "./category";
import {Email} from "./email";
import {Logger} from "./logger";

export class Transaction {

    constructor() {
        this.range = 'F1:BD24';
        this.className = 'transaction';
        this.googleSheetsApi = new Google();
        this.logger = new Logger()
    }

    async updateTransactions(transactionList) {

        try {
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

            let transactionLog = this.insertTransactionsIntoCells(transactionList, cells);

            await this.googleSheetsApi.update({req: params, data: cells});

            new Email({
                subject: 'Transaction Log',
                html: this.generateTransactionLogHTML(transactionLog)
            }).send();

            this.logger.log({
                level: 'info',
                message: transactionLog
            });

            return transactionLog;

        }
        catch(e) {
            this.logger.log({
                level: 'error',
                message: e.toString()
            });
            new Email({
                subject: 'Transaction Error',
                html: e.toString()
            }).send()
        }

    }

    generateTransactionLogHTML(transactionLog) {

        let table = "<table style='width:100%'>" +
               "<tr>" +
                 "<th>Date</th>" +
                 "<th>Merchant</th>" +
                 "<th>Amount</th>" +
                 "<th>Open Cell</th>" +
               "</tr>";

        for (let i = 0; i < transactionLog.length; i++) {
            table = table +
                "<tr>" +
                  "<td>"+ transactionLog[0].date + "</td>" +
                  "<td>"+ transactionLog[0].merchant_name + "</td>" +
                  "<td>"+ transactionLog[0].amount + "</td>" +
                  "<td>"+ transactionLog[0].open_cell + "</td>" +
                "</tr>";
        }

        return table + "</table>";
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
        let transactionLogList = [];
        transactionList.forEach(function (transaction) {
            if (self.uniqueTransaction(transaction, cells)) {
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

        return row[transaction.columnNumber] === transaction.date &&
            row[transaction.columnNumber + 1] === transaction.merchant_name &&
            parseFloat(row[transaction.columnNumber + 2]) === Math.abs(transaction.amount)

    }

    inputTransactionIntoRow(transaction, cells) {

        let newTransactionLogItem = {
            open_cell: false
        };

        for (let i = 3; i < 20; i++) {
            if (
                cells[i][transaction.columnNumber] === ' ' &&
                cells[i][transaction.columnNumber + 1] === ' ' &&
                cells[i][transaction.columnNumber + 2] === ' '
            ) {
                cells[i][transaction.columnNumber] = transaction.date;
                cells[i][transaction.columnNumber + 1] = transaction.merchant_name;
                cells[i][transaction.columnNumber + 2] = transaction.amount;

                newTransactionLogItem.open_cell = true;
                newTransactionLogItem.date = transaction.date;
                newTransactionLogItem.merchant_name = transaction.merchant_name;
                newTransactionLogItem.amount = transaction.amount;

                break;
            }
        }
        return newTransactionLogItem;

    }

}
