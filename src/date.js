require('dotenv').config();
import {Google} from "./google";
let moment = require('moment');

export class Date {

    constructor() {
        this.googleSheetsApi = new Google();
    }

    async updateSheet() {

        let sheetNames = await this.googleSheetsApi.getSheets();

        let exist = this.currentMonthSheetExists(sheetNames);

        if (!exist) {
            let newSheet = await this.copyNewSheetFromTemplate();
            await this.updateSheetName(newSheet);
            return {updated: true}
        }

        return {updated: false}

    }

    currentMonthSheetExists(sheetData) {
        let found = 0;
        sheetData.forEach(function(sheet) {
            if (sheet.properties.title === moment().format('MM-YY')) {
                found = 1;
            }
        });
        return found;
    }

    async copyNewSheetFromTemplate() {
        return await this.googleSheetsApi.copyTo();
    }

    async updateSheetName(newSheet) {
        await this.googleSheetsApi.batchUpdate(newSheet);
    }

}
