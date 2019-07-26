require('dotenv').config();
const currency = require('currency.js');

import "@babel/polyfill";
import {Google} from "./google";

export class Balance {

    constructor() {
        this.googleSheetsApi = new Google();
        this.range = 'A10:D15';
        this.className = 'balance';
    }

    async updateAccountBalance(accountList) {

        let params = {
            range: this.range,
            className: this.className,
            methodName: 'updateAccountBalance',
        };

        let data = await this.googleSheetsApi.get(params);

        let updatedCells = this.updateCellValues(data, accountList);

        return await this.googleSheetsApi.update({req: params, data: updatedCells});

    }

    updateCellValues(dataFromSheet, accountList) {
        for (let i = 0; i < dataFromSheet.length; i++) {
            for (let j = 0; j < accountList.length; j++) {
                if (dataFromSheet[i][0] === accountList[j].name + '-' + accountList[j].account_name) {
                    dataFromSheet[i][3] = accountList[j].balance;
                    if (accountList[j].account_name === 'credit') {
                        dataFromSheet[i][3] = currency(dataFromSheet[i][3]).multiply(-1)
                        dataFromSheet[i][3] = dataFromSheet[i][3] + ''
                    }
                }
            }
        }
        return dataFromSheet;
    }
}
