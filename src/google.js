const {google} = require('googleapis');
const sheets = google.sheets('v4');
const jwtClient = require('./auth.js');
const moment = require('moment');
import {Logger} from "./logger";

export class Google {

    constructor() {
        this.logger = new Logger();
    }

    async get(params) {

        let self = this;

        let request = {
            spreadsheetId: process.env['SPREADSHEET_ID'],
            range: moment().format('MM-YY') + '!' + params.range,
            auth: jwtClient,
        };

        return new Promise(function(resolve, reject){
            sheets.spreadsheets.values.get(request, function (err, response) {
                if (err) {
                    self.logger.log({
                        level: 'error',
                        message: moment().format() + ' class.' + params.className + '.'
                            + params.methodName + ' ' + err
                    });
                    reject(err);
                    return err;
                }
                resolve(response.data.values);
            });
        });

    }

    async update(params) {

        let self = this;

        let moment = require('moment');

        let values = params.data;

        const resource = {
            values,
        };

        let request = {
            spreadsheetId: process.env['SPREADSHEET_ID'],
            range: moment().format('MM-YY') + '!' + params.req.range,
            valueInputOption: 'USER_ENTERED',
            auth: jwtClient,
            resource: resource
        };

        return new Promise(function(resolve, reject){
            sheets.spreadsheets.values.update(request, function (err, response) {

                if (err) {
                    self.logger.log({
                        level: 'error',
                        message: moment().format() + ' class.' + params.req.className +
                            '.' + params.req.methodName + ' ' + err
                    });
                    reject(err);
                    return err;
                }

                resolve('Success')
            })
        });

    }

    async getSheets(params) {

        let self = this;

        return new Promise(function(resolve, reject){
            sheets.spreadsheets.get({
                auth: jwtClient,
                spreadsheetId: process.env['SPREADSHEET_ID'],
            }, function (err, response) {

                if (err) {
                    self.logger.log({
                        level: 'error',
                        message: moment().format() + ' class.date.getAllSheetNames ' + err
                    });
                    reject(err);
                    return err;

                }
                else {
                    resolve(response.data.sheets);
                }
            });

        });

    }

    async copyTo(params) {

        let self = this;

        return new Promise(function(resolve, reject){

            let request = {
                spreadsheetId: process.env['SPREADSHEET_ID'],
                sheetId: process.env['SHEET_ID'],
                resource: {
                    destinationSpreadsheetId: process.env['SPREADSHEET_ID'],
                },
                auth: jwtClient,
            };

            sheets.spreadsheets.sheets.copyTo(request, function (err, response) {
                if (err) {
                    self.logger.log({
                        level: 'error',
                        message: moment().format() + ' class.date.copyFromTemplateToNewSheet ' + JSON.stringify(err)
                    });
                    reject(err);
                    return err;
                }
                resolve(response.data);
            });

        });

    }

    async batchUpdate(params) {

        let self = this;

        return new Promise(function(resolve, reject){

            let request = {
                spreadsheetId: process.env['SPREADSHEET_ID'],
                resource: {
                    requests: [
                        {
                            updateSheetProperties: {
                                properties: {
                                    sheetId: params.sheetId,
                                    title: moment().format('MM-YY')
                                },
                                fields: "title",
                            }
                        }
                    ],
                },
                auth: jwtClient,
            };

            sheets.spreadsheets.batchUpdate(request, function (err, response) {
                if (err) {
                    self.logger.log({
                        level: 'error',
                        message: moment().format() + ' class.date.updateSheetName ' + err
                    });
                    reject(err);
                }
                resolve(response);
                return err;
            });

        });

    }

}
