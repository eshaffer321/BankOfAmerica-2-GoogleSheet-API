import '@babel/polyfill';
import {Income} from '../src/income';
import {Google} from '../src/google';
import {Category} from "../src/category";

jest.mock('../src/google');

describe('Income Class', () => {
	describe('insertIncome Method', () => {
		it('Should return only income transactions', async () => {
			Google.mockImplementation(() => {
				return {
					get: async () => {
						return [
							['03-15-2019', ' ', ' ', 14.98],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' '],
							[' ', ' ', ' ', ' ']
						];
					},
					update: async () => {
						return 'Success';
					}
				};
			});

			const transactionList = [{
				merchantName: 'Counter Credit',
				amount: '100.00',
				category: 'Income',
				date: '07/03/2019',
				description: 'activity type deposit',
				transactionType: 'checking'
			}, {
				merchantName: 'EDWARD JONES',
				amount: '-200.00',
				category: 'Savings & Transfers: Savings',
				date: '07/01/2019',
				description: 'EDWARD JONES DES:INVESTMENT ID:12345 721813321 INDN:JANE DOE CO ID:XXXXX45811 PPD',
				transactionType: 'checking'
			}, {
				merchantName: 'VENMO',
				amount: '-30.29',
				category: 'Cash, Checks & Misc: Other Expenses',
				date: '07/01/2019',
				description: 'VENMO 06/28 PURCHASE 855-812-4430 NY',
				transactionType: 'checking'
			}];

			const income = new Income();

			await income.insertIncome(transactionList);

			expect(Google).toHaveBeenCalledTimes(1);
		});
	});

	describe('createIncomeList Method', () => {
		it('Should return only income transactions', () => {
			const transactionList = [{
				merchantName: 'Counter Credit',
				amount: '100.00',
				category: 'Income',
				date: '07/03/2019',
				description: 'activity type deposit',
				transactionType: 'checking'
			}, {
				merchantName: 'EDWARD JONES',
				amount: '-200.00',
				category: 'Savings & Transfers: Savings',
				date: '07/01/2019',
				description: 'EDWARD JONES DES:INVESTMENT ID:12345 721813321 INDN:JANE DOE CO ID:XXXXX45811 PPD',
				transactionType: 'checking'
			}, {
				merchantName: 'VENMO',
				amount: '-30.29',
				category: 'Cash, Checks & Misc: Other Expenses',
				date: '07/01/2019',
				description: 'VENMO 06/28 PURCHASE 855-812-4430 NY',
				transactionType: 'checking'
			}];

			const income = new Income();

			const result = income.createIncomeList(transactionList);

			expect(result.length).toEqual(1);
		});
	});

	describe('unique Method', () => {
		it('Should return true for unique transaction', () => {
			const cells = [
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' ']
			];

			const transactionList = {
				date: '03-15-2019',
				amount: '14.98',
				category: 'Income'
			};

			const income = new Income();

			const result = income.unique(transactionList, cells);

			expect(result).toEqual(true);
		});

		it('Should return false for duplicate transaction', () => {
			const cells = [
				['03-15-2019', ' ', ' ', '14.98'],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' ']
			];

			const transactionList = {
				date: '03-15-2019',
				amount: '14.98',
				category: 'Income'
			};

			const income = new Income();

			const result = income.unique(transactionList, cells);

			expect(result).toEqual(false);
		});
	});

	describe('insert Method', () => {
		it('Should return true for unique transaction', () => {
			const cells = [
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' ']
			];

			const transaction = {
				date: '03-15-2019',
				amount: '14.98',
				category: 'Income'
			};

			const income = new Income();

			income.insert(transaction, cells);

			expect(cells[0][0]).toEqual('03-15-2019');
			expect(cells[0][3]).toEqual(14.98);
		});

		it('Should return true for unique transaction', () => {
			const cells = [
				['03-15-2019', ' ', ' ', 14.98],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' ']
			];

			const transaction = {
				date: '03-24-2019',
				amount: '20.00',
				category: 'Income'
			};

			const income = new Income();

			income.insert(transaction, cells);

			expect(cells[1][0]).toEqual('03-24-2019');
			expect(cells[1][3]).toEqual(20.00);
		});
	});

	describe('insertIncomeList Method', () => {
		it('Should return true for unique transaction', () => {
			const cells = [
				['03-15-2019', ' ', ' ', 14.98],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' '],
				[' ', ' ', ' ', ' ']
			];

			const transactionList = [{
				date: '03-15-2019',
				amount: '14.98',
				category: 'Income'
			}, {
				date: '03-20-2019',
				amount: '20.00',
				category: 'Income'
			}, {
				date: '03-21-2019',
				amount: '22.00',
				category: 'Income'
			}, {
				date: '03-25-2019',
				amount: '23.00',
				category: 'Income'
			}];

			const income = new Income();

			income.insertIncomeList(transactionList, cells);

			expect(cells[0][0]).toEqual('03-15-2019');
			expect(cells[0][3]).toEqual(14.98);
			expect(cells[1][0]).toEqual('03-20-2019');
			expect(cells[1][3]).toEqual(20.00);
			expect(cells[2][0]).toEqual('03-21-2019');
			expect(cells[2][3]).toEqual(22.00);
			expect(cells[3][0]).toEqual('03-25-2019');
			expect(cells[3][3]).toEqual(23.00);
			expect(cells[4][3]).toEqual(' ');
			expect(cells[4][3]).toEqual(' ');
		});

		it('Should return only income transactions 2', async () => {
			const transactionList = require('./resources/transaction-list-5');
			const incomeCells = require('./resources/income-list');

			const income = new Income();

			let category = new Category();

			category.categorize(transactionList);

			let incomeList = income.createIncomeList(transactionList);

			await income.insertIncomeList(incomeList, incomeCells);

			let found = 0;

            incomeList.forEach(incomeItem => {
				if (incomeItem[0] !== ' ') {
					found++;
				}
			});

            expect(incomeList.length).toEqual(20);
			expect(found).toEqual(20);
		});
	});
});
