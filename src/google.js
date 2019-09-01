import {Logger} from './logger';

const {google} = require('googleapis');

const sheets = google.sheets('v4');
const moment = require('moment');
const jwtClient = require('./auth.js');

export class Google {
	constructor() {
		this.logger = new Logger();
	}

	async get(params) {
		const self = this;

		const request = {
			spreadsheetId: process.env.SPREADSHEET_ID,
			range: moment().format('MM-YY') + '!' + params.range,
			auth: jwtClient
		};

		return new Promise(((resolve, reject) => {
			sheets.spreadsheets.values.get(request, (err, response) => {
				if (err) {
					self.logger.log({
						level: 'error',
						message: 'class.' + params.className + '.' +
                            params.methodName + ' ' + err
					});
					reject(err);
					return err;
				}

				resolve(response.data.values);
			});
		}));
	}

	async update(params) {
		const self = this;

		const moment = require('moment');

		const values = params.data;

		const resource = {
			values
		};

		const request = {
			spreadsheetId: process.env.SPREADSHEET_ID,
			range: moment().format('MM-YY') + '!' + params.req.range,
			valueInputOption: 'USER_ENTERED',
			auth: jwtClient,
			resource
		};

		return new Promise(((resolve, reject) => {
			sheets.spreadsheets.values.update(request, (err, response) => {
				if (err) {
					self.logger.log({
						level: 'error',
						message: 'class.' + params.req.className +
                            '.' + params.req.methodName + ' ' + JSON.stringify(err)
					});
					reject(err);
					return err;
				}

				resolve('Success');
			});
		}));
	}

	async getSheets(params) {
		const self = this;

		return new Promise(((resolve, reject) => {
			sheets.spreadsheets.get({
				auth: jwtClient,
				spreadsheetId: process.env.SPREADSHEET_ID
			}, (err, response) => {
				if (err) {
					self.logger.log({
						level: 'error',
						message: 'class.date.getAllSheetNames ' + JSON.stringify(err)
					});
					reject(err);
					return err;
				}

				resolve(response.data.sheets);
			});
		}));
	}

	async copyTo(params) {
		const self = this;

		return new Promise(((resolve, reject) => {
			const request = {
				spreadsheetId: process.env.SPREADSHEET_ID,
				sheetId: process.env.SHEET_ID,
				resource: {
					destinationSpreadsheetId: process.env.SPREADSHEET_ID
				},
				auth: jwtClient
			};

			sheets.spreadsheets.sheets.copyTo(request, (err, response) => {
				if (err) {
					self.logger.log({
						level: 'error',
						message: 'class.date.copyFromTemplateToNewSheet ' + JSON.stringify(err)
					});
					reject(err);
					return err;
				}

				resolve(response.data);
			});
		}));
	}

	async batchUpdate(params) {
		const self = this;

		return new Promise(((resolve, reject) => {
			const request = {
				spreadsheetId: process.env.SPREADSHEET_ID,
				resource: {
					requests: [
						{
							updateSheetProperties: {
								properties: {
									sheetId: params.sheetId,
									title: moment().format('MM-YY')
								},
								fields: 'title'
							}
						}
					]
				},
				auth: jwtClient
			};

			sheets.spreadsheets.batchUpdate(request, (err, response) => {
				if (err) {
					self.logger.log({
						level: 'error',
						message: 'class.date.updateSheetName ' + JSON.stringify(err)
					});
					reject(err);
				}

				resolve(response);
				return err;
			});
		}));
	}
}
