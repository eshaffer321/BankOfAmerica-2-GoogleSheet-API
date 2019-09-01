import '@babel/polyfill';
import {Category} from '../src/category';

describe('Category Class', () => {
	const category = new Category();

	describe('categorizeVenmo Method', () => {
		it('Should categorize as other', () => {
			const venmoExpense = {
				merchantName: 'VENMO',
				amount: '-30.29',
				category: 'Cash, Checks & Misc: Other Expenses',
				date: '07/01/2019',
				description: 'VENMO 06/28 PURCHASE 855-812-4430 NY',
				transactionType: 'checking'
			};

			const category = new Category();

			category.categorizeVenmo(venmoExpense);

			expect(venmoExpense.amount).toEqual('-30.29');
			expect(venmoExpense.category).toEqual('Other');
		});

		it('Should categorize as Income', () => {
			const venmoIncome = {
				merchantName: 'VENMO',
				amount: '370.00',
				category: 'Income: Deposits',
				date: '07/01/2019',
				description: 'VENMO 06/28 PURCHASE 855-812-4430 NY',
				transactionType: 'checking'
			};

			category.categorizeVenmo(venmoIncome);

			expect(venmoIncome.amount).toEqual('370.00');
			expect(venmoIncome.category).toEqual('Income');
		});

		it('Should not re-categorize into income', () => {
			const venmoExpense = {
				merchantName: 'VENMO',
				amount: '-370.00',
				category: 'Income: Deposits',
				date: '07/01/2019',
				description: 'VENMO 06/28 PURCHASE 855-812-4430 NY',
				transactionType: 'checking'
			};

			category.categorizeVenmo(venmoExpense);
			category.categorizeVenmo(venmoExpense);

			expect(venmoExpense.amount).toEqual('-370.00');
			expect(venmoExpense.category).toEqual('Other');
		});
	});

	describe('categorizeItem Method', () => {
		const category = new Category();

		it('Should categorize as student loan', () => {
			const transaction = {
				merchantName: 'FEDLOAN SERVICING',
				amount: '-30.29',
				category: 'Education: Education',
				date: '07/01/2019',
				description: 'FEDLOANSERVICING DES:STDNT LOAN ID:6NCF2VCSKB1 INDN:ERICK SHAFFER CO ID:XXXXX00802 WEB',
				transactionType: 'checking'
			};

			const rule = {
				expression: 'FEDLOAN SERVICING',
				properties_to_match: [
					'merchantName'
				],
				updated_values: {
					category: 'Student Loans'
				}
			};

			category.categorizeItem(rule, transaction);

			expect(transaction.category).toEqual('Student Loans');
		});

		it('Should categorize as Rent', () => {
			const transaction = {
				merchantName: 'Check',
				amount: '-3,495.00',
				category: 'Cash, Checks & Misc: Checks',
				date: '07/01/2019',
				description: 'activity type check',
				transactionType: 'checking'
			};

			const rule = {
				expression: '-3,495.00',
				properties_to_match: [
					'amount'
				],
				updated_values: {
					category: 'Rent'
				}
			};

			category.categorizeItem(rule, transaction);
			expect(transaction.category).toEqual('Rent');
		});

		it('Should categorize as Gym', () => {
			const transaction = {
				merchantName: 'YMCA',
				amount: '$79.00',
				category: 'Shopping & Entertainment: Hobbies',
				date: '07/23/2019',
				description: 'YMCA SILICON VALLEY-AO DR408-3516473 CA',
				transactionType: 'credit'
			};

			const rule = {
				expression: 'YMCA',
				properties_to_match: [
					'merchantName'
				],
				updated_values: {
					category: 'Gym'
				}
			};

			category.categorizeItem(rule, transaction);
			expect(transaction.category).toEqual('Gym');
		});
	});

	describe('categorize Method', () => {
		const category = new Category();

		it('Should properly categorize a list of transactions', () => {
			const transactionList = [{
				merchantName: 'PACIFIC GAS AND ELECTRIC',
				amount: '-41.60',
				category: 'Home & Utilities: Utilities',
				date: '07/02/2019',
				description: 'PGANDE DES:WEB ONLINE ID:XXXXX811063019 INDN:ERICK SHAFFER CO ID:XXXXX42640 WEB',
				transactionType: 'checking'
			},
			{
				merchantName: 'FEDLOAN SERVICING',
				amount: '-4,957.54',
				category: 'Education: Education',
				date: '07/02/2019',
				description: 'FEDLOANSERVICING DES:STDNT LOAN ID:6NCF2VCSKB1 INDN:ERICK SHAFFER CO ID:XXXXX00802 WEB',
				transactionType: 'checking'
			},
			{
				merchantName: 'RIDGE VINEYARDS - MONTEB',
				amount: '$30.00',
				category: 'Groceries: Groceries',
				date: '07/09/2019',
				description: 'RIDGE VINEYARDS - MONTEBCUPERTINO CA',
				transactionType: 'credit'
			},
			{
				merchantName: 'Audible US*MH2BQ60Y2',
				amount: '$14.95',
				category: 'Shopping & Entertainment: General Merchandise',
				date: '07/08/2019',
				description: 'Audible US*MH2BQ60Y2 888-283-5051 NJ',
				transactionType: 'credit'
			},
			{
				merchantName: 'PIZZERIA VENTI',
				amount: '$122.25',
				category: 'Restaurants & Dining: Restaurants/Dining',
				date: '07/06/2019',
				description: 'PIZZERIA VENTI MOUNTAIN VIEWCA',
				transactionType: 'credit'
			},
			{
				merchantName: 'YMCA',
				amount: '$79.00',
				category: 'Shopping & Entertainment: Hobbies',
				date: '07/23/2019',
				description: 'YMCA SILICON VALLEY-AO DR408-3516473 CA',
				transactionType: 'credit'
			}];

			category.categorize(transactionList);

			expect(transactionList[0].category).toEqual('Utilities');
			expect(transactionList[1].category).toEqual('Student Loans');
			expect(transactionList[2].category).toEqual('Entertainment');
			expect(transactionList[3].category).toEqual('Subscriptions');
			expect(transactionList[4].category).toEqual('Restaurants & Dining');
			expect(transactionList[5].category).toEqual('Gym');
		});

		it('Should properly categorize a list of transactions', () => {
			const transactionList = [{
				amount: '$37.70',
				description: 'COSTCO GAS #0423 SUNNYVALE CA',
				date: '08/13/2019',
				merchantName: 'COSTCO',
				category: 'Transportation: Gasoline/Fuel'
			}, {
				amount: '$104.70',
				description: 'COSTCO WHSE #0423 SUNNYVALE CA',
				date: '08/13/2019',
				merchantName: 'COSTCO',
				category: 'Shopping & Entertainment: General Merchandise'
			}];

			category.categorize(transactionList);

			expect(transactionList[0].category).toEqual('Transportation');
			expect(transactionList[1].category).toEqual('Groceries');
		});
	});
});
