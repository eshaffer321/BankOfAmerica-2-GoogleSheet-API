const {google} = require('googleapis');
const sheets = google.sheets('v4');
const jwtClient = require('./auth/auth.js');
const moment = require('moment');
const logger = require('./logger');

export class Google {

    async get(params) {

        let request = {
            spreadsheetId: process.env['SPREADSHEET_ID'],
            range: moment().format('MM-YY') + '!' + params.range,
            auth: jwtClient,
        };

        return new Promise(function(resolve, reject){
            sheets.spreadsheets.values.get(request, function (err, response) {
                if (err) {
                    console.log(err);
                    logger.log({
                        level: 'error',
                        message: moment().format() + ' class.' + params.className + '.'
                            + params.methodName + ' ' + err.errors[0].message
                    });
                    reject(err);
                    return err;
                }
                resolve(response.data.values);
            });
        });

    }

    async update(params) {
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
                    logger.log({
                        level: 'error',
                        message: moment().format() + ' class.' + params.req.className +
                            '.' + params.req.methodName + ' ' + err.errors[0].message
                    });
                    reject(err);
                    return err;
                }

                resolve('Success')
            })
        });

    }

    async getSheets(params) {

        return new Promise(function(resolve, reject){
            sheets.spreadsheets.get({
                auth: jwtClient,
                spreadsheetId: process.env['SPREADSHEET_ID'],
            }, function (err, response) {

                if (err) {
                    logger.log({
                        level: 'error',
                        message: logger().format() + ' class.date.getAllSheetNames ' + err.errors[0].message
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
                    logger.log({
                        level: 'error',
                        message: logging().format() + ' class.date.copyFromTemplateToNewSheet ' + JSON.stringify(err)
                    });
                    reject(err);
                    return err;
                }
                resolve(response.data);
            });
        });

    }

    async batchUpdate(params) {

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
                    logger.log({
                        level: 'error',
                        message: logger().format() + ' class.date.updateSheetName ' + err.errors[0].message
                    });
                    reject(err);
                }
                resolve(response);
                return err;
            });
        });

    }

}
