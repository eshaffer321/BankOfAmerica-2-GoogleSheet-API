import {Balance} from '../src/balance';
import {Google} from '../src/google';

jest.mock('../src/google');

describe('Balance Class', () => {
	describe('updateCellValues Method', () => {
		let dataFromSheet = [];

		beforeEach(() => {
			dataFromSheet = [['don-checking', '', '', ' '],
				['don-savings', '', '', ' '],
				['don-credit', '', '', ' '],
				['mia-checking', '', '', ' '],
				['mia-savings', '', '', ' '],
				['mia-credit', '', '', ' ']];
		});

		it('Should put the values in the transaction-google-cells.js', () => {
			const accountList = [{
				balance: '$1,111.11',
				account_name: 'checking',
				name: 'mia'
			}, {balance: '$2,222.22', account_name: 'savings', name: 'mia'}, {
				balance: '$133.37',
				account_name: 'credit',
				name: 'mia'
			}];
			const balance = new Balance();
			const newCellValues = balance.updateCellValues(dataFromSheet, accountList);
			expect(newCellValues[3][3]).toEqual('$1,111.11');
			expect(newCellValues[4][3]).toEqual('$2,222.22');
			expect(newCellValues[4][3]).toEqual('$2,222.22');
			expect(newCellValues[5][3]).toEqual('-133.37');
		});

		it('Should correctly enter 4 digit credit entry', () => {
			const accountList = [{
				balance: '$1,111.11',
				account_name: 'checking',
				name: 'mia'
			}, {balance: '$2,222.22', account_name: 'savings', name: 'mia'}, {
				balance: '$1,133.37',
				account_name: 'credit',
				name: 'mia'
			}];
			const balance = new Balance();
			const newCellValues = balance.updateCellValues(dataFromSheet, accountList);
			expect(newCellValues[3][3]).toEqual('$1,111.11');
			expect(newCellValues[4][3]).toEqual('$2,222.22');
			expect(newCellValues[4][3]).toEqual('$2,222.22');
			expect(newCellValues[5][3]).toEqual('-1133.37');
		});

		it('Should override existing entry', () => {
			const accountList = [{
				balance: '$1,111.11',
				account_name: 'checking',
				name: 'mia'
			}, {balance: '$2,222.22', account_name: 'savings', name: 'mia'}, {
				balance: '$1,133.37',
				account_name: 'credit',
				name: 'mia'
			}];
			const balance = new Balance();
			const newCellValues = balance.updateCellValues(dataFromSheet, accountList);

			const newAccountList = [{
				balance: '$8,888.88',
				account_name: 'checking',
				name: 'mia'
			}, {balance: '$2,222.22', account_name: 'savings', name: 'mia'}, {
				balance: '$1,133.37',
				account_name: 'credit',
				name: 'mia'
			}];

			const finalCellValues = balance.updateCellValues(newCellValues, newAccountList);
			expect(finalCellValues[3][3]).toEqual('$8,888.88');
		});
	});

	describe('updateAccountBalance Method', () => {
		beforeAll(() => {
			Google.mockImplementation(() => {
				return {
					get: () => {
						return [['don-checking', '', '', ' '],
							['don-savings', '', '', ' '],
							['don-credit', '', '', ' '],
							['mia-checking', '', '', ' '],
							['mia-savings', '', '', ' '],
							['mia-credit', '', '', ' ']];
					},
					update: () => {
						return 'Success';
					}
				};
			});
		});

		it('should get a Success response', async () => {
			const accountList = [{
				balance: '$1,111.11',
				account_name: 'checking',
				name: 'mia'
			}, {balance: '$2,222.22', account_name: 'savings', name: 'mia'}, {
				balance: '$1,133.37',
				account_name: 'credit',
				name: 'mia'
			}];
			const balance = new Balance();
			const result = await balance.updateAccountBalance(accountList);
			expect(result).toEqual('Success');
		});
	});
});

