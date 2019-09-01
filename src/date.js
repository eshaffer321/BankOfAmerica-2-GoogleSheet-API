import {Google} from './google';

const moment = require('moment');

export class Date {
	constructor() {
		this.googleSheetsApi = new Google();
	}

	async updateSheet() {
		const sheetNames = await this.googleSheetsApi.getSheets();

		const exist = this.currentMonthSheetExists(sheetNames);

		if (!exist) {
			const newSheet = await this.copyNewSheetFromTemplate();
			await this.updateSheetName(newSheet);
			return {updated: true};
		}

		return {updated: false};
	}

	currentMonthSheetExists(sheetData) {
		let found = 0;
		sheetData.forEach(sheet => {
			if (sheet.properties.title === moment().format('MM-YY')) {
				found = 1;
			}
		});
		return found;
	}

	async copyNewSheetFromTemplate() {
		return this.googleSheetsApi.copyTo();
	}

	async updateSheetName(newSheet) {
		await this.googleSheetsApi.batchUpdate(newSheet);
	}
}
