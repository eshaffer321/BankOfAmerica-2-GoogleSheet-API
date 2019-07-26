import "@babel/polyfill"
import {Category} from "../src/category";


describe('Category Class', () => {

    let category = new Category();

    describe('categorizeVenmo Method', () => {

        it('Should categorize as other', () => {

            let venmoExpense = {
                'merchant_name': 'VENMO',
                'amount': '-30.29',
                'category': 'Cash, Checks & Misc: Other Expenses',
                'date': '07/01/2019',
                'description': 'VENMO 06/28 PURCHASE 855-812-4430 NY',
                'transaction_type': 'checking'
            };

            let category = new Category();

            category.categorizeVenmo(venmoExpense);

            expect(venmoExpense.amount).toEqual('-30.29');
            expect(venmoExpense.category).toEqual('Other');
        });

        it('Should categorize as Income', () => {

            let venmoIncome = {
                'merchant_name': 'VENMO',
                'amount': '370.00',
                'category': 'Income: Deposits',
                'date': '07/01/2019',
                'description': 'VENMO 06/28 PURCHASE 855-812-4430 NY',
                'transaction_type': 'checking'
            };

            category.categorizeVenmo(venmoIncome);

            expect(venmoIncome.amount).toEqual('370.00');
            expect(venmoIncome.category).toEqual('Income');
        });

        it('Should not re-categorize into income', () => {

            let venmoExpense = {
                'merchant_name': 'VENMO',
                'amount': '-370.00',
                'category': 'Income: Deposits',
                'date': '07/01/2019',
                'description': 'VENMO 06/28 PURCHASE 855-812-4430 NY',
                'transaction_type': 'checking'
            };

            category.categorizeVenmo(venmoExpense);
            category.categorizeVenmo(venmoExpense);

            expect(venmoExpense.amount).toEqual('-370.00');
            expect(venmoExpense.category).toEqual('Other');
        });

    });

    describe('categorizeItem Method', () => {

        let category = new Category();

        it('Should categorize as student loan', () => {

            let transaction = {
                'merchant_name': 'FEDLOAN SERVICING',
                'amount': '-30.29',
                'category': 'Education: Education',
                'date': '07/01/2019',
                'description': 'FEDLOANSERVICING DES:STDNT LOAN ID:6NCF2VCSKB1 INDN:ERICK SHAFFER CO ID:XXXXX00802 WEB',
                'transaction_type': 'checking'
            };

            let rule = {
                "expression": "FEDLOAN SERVICING",
                "properties_to_match": [
                    "merchant_name"
                ],
                "updated_values": {
                    "category": "Student Loans"
                }
            };

            category.categorizeItem(rule, transaction);

            expect(transaction.category).toEqual('Student Loans');
        });

        it('Should categorize as Rent', () => {

            let transaction = {
                'merchant_name': 'Check',
                'amount': '-3,495.00',
                'category': 'Cash, Checks & Misc: Checks',
                'date': '07/01/2019',
                'description': 'activity type check',
                'transaction_type': 'checking'
            };

            let rule = {
                "expression": "-3,495.00",
                "properties_to_match": [
                    "amount"
                ],
                "updated_values": {
                    "category": "Rent"
                }
            };

            category.categorizeItem(rule, transaction);
            expect(transaction.category).toEqual('Rent');
        });

        it('Should categorize as Gym', () => {

            let transaction = {
                'merchant_name': 'YMCA',
                'amount': '$79.00',
                'category': 'Shopping & Entertainment: Hobbies',
                'date': '07/23/2019',
                'description': 'YMCA SILICON VALLEY-AO DR408-3516473 CA',
                'transaction_type': 'credit'
            };

            let rule = {
                "expression": "YMCA",
                "properties_to_match": [
                    "merchant_name"
                ],
                "updated_values": {
                    "category": "Gym"
                }
            };

            category.categorizeItem(rule, transaction);
            expect(transaction.category).toEqual('Gym');
        });

    });

    describe('categorize Method', () => {

        let category = new Category();

        it('Should properly categorize a list of transactions', () => {


            let transactionList = [{
                'merchant_name': 'PACIFIC GAS AND ELECTRIC',
                'amount': '-41.60',
                'category': 'Home & Utilities: Utilities',
                'date': '07/02/2019',
                'description': 'PGANDE DES:WEB ONLINE ID:XXXXX811063019 INDN:ERICK SHAFFER CO ID:XXXXX42640 WEB',
                'transaction_type': 'checking'
            }, {
                'merchant_name': 'FEDLOAN SERVICING',
                'amount': '-4,957.54',
                'category': 'Education: Education',
                'date': '07/02/2019',
                'description': 'FEDLOANSERVICING DES:STDNT LOAN ID:6NCF2VCSKB1 INDN:ERICK SHAFFER CO ID:XXXXX00802 WEB',
                'transaction_type': 'checking'
            }, {
                'merchant_name': 'RIDGE VINEYARDS - MONTEB',
                'amount': '$30.00',
                'category': 'Groceries: Groceries',
                'date': '07/09/2019',
                'description': 'RIDGE VINEYARDS - MONTEBCUPERTINO CA',
                'transaction_type': 'credit'
            }, {
                'merchant_name': 'Audible US*MH2BQ60Y2',
                'amount': '$14.95',
                'category': 'Shopping & Entertainment: General Merchandise',
                'date': '07/08/2019',
                'description': 'Audible US*MH2BQ60Y2 888-283-5051 NJ',
                'transaction_type': 'credit'
            }, {
                'merchant_name': 'PIZZERIA VENTI',
                'amount': '$122.25',
                'category': 'Restaurants & Dining: Restaurants/Dining',
                'date': '07/06/2019',
                'description': 'PIZZERIA VENTI MOUNTAIN VIEWCA',
                'transaction_type': 'credit'
            },
            {
                'merchant_name': 'YMCA',
                'amount': '$79.00',
                'category': 'Shopping & Entertainment: Hobbies',
                'date': '07/23/2019',
                'description': 'YMCA SILICON VALLEY-AO DR408-3516473 CA',
                'transaction_type': 'credit'
            }];

            category.categorize(transactionList);

            expect(transactionList[0].category).toEqual('Utilities');
            expect(transactionList[1].category).toEqual('Student Loans');
            expect(transactionList[2].category).toEqual('Entertainment');
            expect(transactionList[3].category).toEqual('Subscriptions');
            expect(transactionList[4].category).toEqual('Restaurants & Dining');
            expect(transactionList[5].category).toEqual('Gym');

        });

    });

});
