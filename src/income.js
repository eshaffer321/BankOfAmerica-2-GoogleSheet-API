import {Google} from "./google";

require('dotenv').config();

export class Income {

    constructor() {
        this.googleSheetsApi = new Google();
        this.range = 'A21:D100';
        this.className = 'Income';
    }

    async insertIncome(transactionList) {

        let params = {
            range: this.range,
            className: this.className,
            methodName: 'insertIncome',
        };

        let cells = await this.googleSheetsApi.get(params);

        let incomeList = this.createIncomeList(transactionList);

        this.insertIncomeList(incomeList, cells);

        await this.googleSheetsApi.update({req: params, data: cells});
    }


    createIncomeList(transactionList) {

        let incomeList = [];

        transactionList.forEach(function(transaction) {
            if (transaction.category === 'Income') {
                incomeList.push(transaction);
            }
        });

        return incomeList;
    }

    insertIncomeList(incomeList, cells) {

        let self = this;
        incomeList.forEach(function(transaction) {
            if (self.unique(transaction, cells)) {
                self.insert(transaction, cells);
            }
        });

    }

    unique(transaction, cells) {

        let isUnique = true;

        cells.forEach(function(row) {
            if (row[0] === transaction.date && row[3] !== ' ' && Math.abs(row[3]) === Math.abs(transaction.amount)) {
                isUnique = false;
            }
        });

        return isUnique;
    }

    insert(transaction, cells) {

        let found = 0;
        cells.forEach(function(row) {
            if (row[0] === ' ' && row[1] === ' ' && row[2] === ' ' && row[3] === ' ' && !found) {
                row[0] = transaction.date;
                row[3] = Math.abs(transaction.amount);
                found = 1;
            }
        });

    }

}
