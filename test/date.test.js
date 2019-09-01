import '@babel/polyfill';
import {Date} from '../src/date';
import {Google} from '../src/google';

const moment = require('moment');

jest.mock('../src/google');

describe('Date Class', () => {
	describe('currentMonthSheetExists Method', () => {
		it('Should return true that sheet is found', () => {
			const sheetList = [
				{
					properties:
                        {
                        	sheetId: 759515713,
                        	title: 'Template'
                        }
				},
				{
					properties:
                        {
                        	sheetId: 356906753,
                        	title: moment().format('MM-YY')
                        }
				}
			];

			const date = new Date();

			const result = date.currentMonthSheetExists(sheetList);

			expect(result).toEqual(1);
		});

		it('Should return false', () => {
			const sheetList = [
				{
					properties:
                        {
                        	sheetId: 759515713,
                        	title: 'Template'
                        }
				},
				{
					properties:
                        {
                        	sheetId: 356906753,
                        	title: '99-99'
                        }
				}
			];

			const date = new Date();

			const result = date.currentMonthSheetExists(sheetList);

			expect(result).toEqual(0);
		});
	});

	describe('copyNewSheetFromTemplate Method', () => {
		beforeAll(() => {
			Google.mockImplementation(() => {
				return {
					copyTo: async () => {
						return {sheetId: 1921568500,
							title: 'Copy of Template',
							index: 2,
							sheetType: 'GRID',
							gridProperties: {rowCount: 1004, columnCount: 56}};
					},
					update: () => {
						return 'Success';
					}
				};
			});
		});

		it('Should return a new sheet', async () => {
			const date = new Date();

			const result = await date.copyNewSheetFromTemplate();

			expect(result.title).toEqual('Copy of Template');
		});
	});

	describe('updateSheet Method', () => {
		beforeAll(() => {
			Google.mockImplementation(() => {
				return {
					copyTo: () => {
						return {sheetId: 1921568500,
							title: 'Copy of Template',
							index: 2,
							sheetType: 'GRID',
							gridProperties: {rowCount: 1004, columnCount: 56}};
					},
					update: () => {
						return 'Success';
					},
					getSheets: () => {
						return [
							{
								properties:
                                    {
                                    	sheetId: 759515713,
                                    	title: 'Template'
                                    }
							},
							{
								properties:
                                    {
                                    	sheetId: 356906753,
                                    	title: '99-10'
                                    }
							}
						];
					},
					batchUpdate: () => {}
				};
			});
		});

		it('Should return false updated status', async () => {
			const date = new Date();

			const result = await date.updateSheet();

			expect(result.updated).toEqual(true);
		});
	});
});
