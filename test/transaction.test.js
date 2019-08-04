import "@babel/polyfill";
import {Transaction} from "../src/transaction";
import {Google} from "../src/google";
import {Logger} from "../src/logger";
import {Email} from "../src/email";

jest.mock("../src/google");
jest.mock("../src/logger");
jest.mock("../src/email");

describe('Transaction Class', () => {

    describe('updateTransactions Method', () => {

        beforeAll(() => {
            Google.mockImplementation(() => {
                return {
                    get: async () => {
                        return require('./resources/transaction-google-cells');
                    },
                    update: () => {
                        return 'Success'
                    }
                };
            });
            Email.mockImplementation(() => {
                return {
                    send: async () => {}
                };
            });
            Logger.mockImplementation(() => {
                return {
                    log: async () => {}
                };
            });
        });

        it('Should properly update transactions', async () => {

            let newTransactions = [{
                'merchant_name': 'EDWARD JONES',
                'amount': '-200.00',
                'category': 'Savings & Transfers: Savings',
                'date': '07/20/2019',
                'description': 'EDWARD JONES DES:INVESTMENT ID:43434 721813321 INDN:JANE DOE CO ID:XXXXX11111 PPD',
                'transaction_type': 'checking'
            }, {
                'merchant_name': 'VENMO',
                'amount': '-50.29',
                'category': 'Cash, Checks & Misc: Other Expenses',
                'date': '07/11/2019',
                'description': 'VENMO 06/28 PURCHASE 855-812-4430 NY',
                'transaction_type': 'checking'
            }, {
                'merchant_name': 'CHEVRON',
                'amount': '$44.23',
                'category': 'Transportation: Gasoline/Fuel',
                'date': '07/21/2019',
                'description': 'CHEVRON 0095006 TAHOE PARADISCA',
                'transaction_type': 'credit'
            }, {
                'merchant_name': '76 - DBA T.B.D.J INC',
                'amount': '$46.38',
                'category': 'Transportation: Gasoline/Fuel',
                'date': '07/06/2019',
                'description': '76 - DBA T.B.D.J INC NEW YORK CA',
                'transaction_type': 'credit'
            }, {
                'merchant_name': 'SUR LA TABLE',
                'amount': '$9.94',
                'category': 'Home & Utilities: Home Improvement',
                'date': '07/04/2019',
                'description': 'SUR LA TABLE LOS GATOS LOS GATOS CA',
                'transaction_type': 'credit'
            }, {
                'merchant_name': 'TJ MAXX',
                'amount': '$176.48',
                'category': 'Shopping & Entertainment: Clothing/Shoes',
                'date': '07/03/2019',
                'description': 'TJMAXX #0628 NEW YORK CA',
                'transaction_type': 'credit'
            }];

            let transaction = new Transaction();

            let results = await transaction.updateTransactions(newTransactions);

            expect(Email).toHaveBeenCalledTimes(1);

            expect(Logger).toHaveBeenCalledTimes(1);

            expect(results).toBeTruthy();

            expect(results.length).toBeGreaterThan(1)

        });

    });

    describe('insertTransactionsIntoCells Method', () => {

        it('Should return a list of transactions inserted', async () => {

            let newTransactions = [{
                'merchant_name': 'EDWARD JONES',
                'amount': 200.00,
                'category': 'Investments',
                'date': '07/31/2019',
                'description': 'EDWARD JONES DES:INVESTMENT ID:12345 721813321 INDN:JANE DOE CO ID:XXXXX44444 PPD',
                'transaction_type': 'checking',
                columnNumber: 24
            }, {
                'merchant_name': 'VENMO',
                'amount': 50.29,
                'category': 'Cash, Checks & Misc: Other Expenses',
                'date': '07/31/2019',
                'description': 'VENMO 06/28 PURCHASE 855-812-4430 NY',
                'transaction_type': 'checking',
                columnNumber: 48
            }, {
                'merchant_name': 'CHEVRON',
                'amount': 44.23,
                'category': 'Transportation: Gasoline/Fuel',
                'date': '07/31/2019',
                'description': 'CHEVRON 0095006 TAHOE PARADISCA',
                'transaction_type': 'credit',
                columnNumber: 33
            }, {
                'merchant_name': '76 - DBA T.B.D.J INC', // DUPLICATE
                'amount': 46.38,
                'category': 'Transportation',
                'date': '07/31/2019',
                'description': '76 - DBA T.B.D.J INC NEW YORK CA',
                'transaction_type': 'credit',
                columnNumber: 33
            }, {
                'merchant_name': 'SUR LA TABLE',
                'amount': 9.94,
                'category': 'Home',
                'date': '07/31/2019',
                'description': 'SUR LA TABLE LOS GATOS LOS GATOS CA',
                'transaction_type': 'credit',
                columnNumber: 45
            }, {
                'merchant_name': 'TJ MAXX',
                'amount': 176.48,
                'category': 'Home',
                'date': '07/31/2019',
                'description': 'TJMAXX #0628 NEW YORK CA',
                'transaction_type': 'credit',
                columnNumber: 45
            },
                {
                    'merchant_name': 'YMCA',
                    'amount': 79.00,
                    'category': 'Gym',
                    'date': '07/31/2019',
                    'description': 'YMCA NEW YORK CA',
                    'transaction_type': 'credit',
                    columnNumber: 15
                }];

            let transaction = new Transaction();

            let cells = require('./resources/transaction-google-cells');

            let results = await transaction.insertTransactionsIntoCells(newTransactions, cells);

            expect(results.length).toEqual(7);

            for (let i = 0; i < results.length; i++) {
                expect(results[i].amount).toBeTruthy();
                expect(results[i].merchant_name).toBeTruthy();
                expect(results[i].date).toBeTruthy();
                expect(results[i].open_cell).toBeTruthy();
            }

        });

        it('Should properly update transactions', async () => {

            let newTransactions = [{
                'merchant_name': 'EDWARD JONES',
                'amount': 200.00,
                'category': 'Investments',
                'date': '07/20/2019',
                'description': 'EDWARD JONES DES:INVESTMENT ID:12345 721813321 INDN:JANE DOE CO ID:XXXXX44444 PPD',
                'transaction_type': 'checking',
                columnNumber: 24
            }, {
                'merchant_name': 'VENMO',
                'amount': 50.29,
                'category': 'Cash, Checks & Misc: Other Expenses',
                'date': '07/11/2019',
                'description': 'VENMO 06/28 PURCHASE 855-812-4430 NY',
                'transaction_type': 'checking',
                columnNumber: 48
            }, {
                'merchant_name': 'CHEVRON',
                'amount': 44.23,
                'category': 'Transportation: Gasoline/Fuel',
                'date': '07/21/2019',
                'description': 'CHEVRON 0095006 TAHOE PARADISCA',
                'transaction_type': 'credit',
                columnNumber: 33
            }, {
                'merchant_name': '76 - DBA T.B.D.J INC',
                'amount': 46.38,
                'category': 'Transportation',
                'date': '07/06/2019',
                'description': '76 - DBA T.B.D.J INC NEW YORK CA',
                'transaction_type': 'credit',
                columnNumber: 33
            }, {
                'merchant_name': 'SUR LA TABLE',
                'amount': 9.94,
                'category': 'Home',
                'date': '07/14/2019',
                'description': 'SUR LA TABLE LOS GATOS LOS GATOS CA',
                'transaction_type': 'credit',
                columnNumber: 45
            }, {
                'merchant_name': 'TJ MAXX',
                'amount': 176.48,
                'category': 'Home',
                'date': '07/13/2019',
                'description': 'TJMAXX #0628 NEW YORK CA',
                'transaction_type': 'credit',
                columnNumber: 45
            },
            {
                'merchant_name': 'YMCA',
                'amount': 79.00,
                'category': 'Gym',
                'date': '07/13/2019',
                'description': 'YMCA NEW YORK CA',
                'transaction_type': 'credit',
                columnNumber: 15
            }];

            let transaction = new Transaction();

            let cells = require('./resources/transaction-google-cells');

            await transaction.insertTransactionsIntoCells(newTransactions, cells);

            for (let i = 0; i < newTransactions.length; i++) {
                expect(transaction.uniqueTransaction(newTransactions[i], cells)).toEqual(false);
            }

        });

    });

    describe('generateTransactionLogHTML Method', () => {

        it('Should return a of html transactions', async () => {

            let newTransactions = [{
                'merchant_name': 'EDWARD JONES',
                'amount': 200.00,
                'category': 'Investments',
                'date': '07/31/2019',
                'description': 'EDWARD JONES DES:INVESTMENT ID:12345 721813321 INDN:JANE DOE CO ID:XXXXX44444 PPD',
                'transaction_type': 'checking',
                columnNumber: 24
            }, {
                'merchant_name': 'VENMO',
                'amount': 50.29,
                'category': 'Cash, Checks & Misc: Other Expenses',
                'date': '07/31/2019',
                'description': 'VENMO 06/28 PURCHASE 855-812-4430 NY',
                'transaction_type': 'checking',
                columnNumber: 48
            }, {
                'merchant_name': 'CHEVRON',
                'amount': 44.23,
                'category': 'Transportation: Gasoline/Fuel',
                'date': '07/31/2019',
                'description': 'CHEVRON 0095006 TAHOE PARADISCA',
                'transaction_type': 'credit',
                columnNumber: 33
            }, {
                'merchant_name': '76 - DBA T.B.D.J INC', // DUPLICATE
                'amount': 46.38,
                'category': 'Transportation',
                'date': '07/31/2019',
                'description': '76 - DBA T.B.D.J INC NEW YORK CA',
                'transaction_type': 'credit',
                columnNumber: 33
            }, {
                'merchant_name': 'SUR LA TABLE',
                'amount': 9.94,
                'category': 'Home',
                'date': '07/01/2019',
                'description': 'SUR LA TABLE LOS GATOS LOS GATOS CA',
                'transaction_type': 'credit',
                columnNumber: 45
            }, {
                'merchant_name': 'TJ MAXX',
                'amount': 176.48,
                'category': 'Home',
                'date': '07/01/2019',
                'description': 'HOMEGOODS',
                'transaction_type': 'credit',
                columnNumber: 45
            },
            {
                'merchant_name': 'YMCA',
                'amount': 79.00,
                'category': 'Gym',
                'date': '07/01/2019',
                'description': 'YMCA NEW YORK CA',
                'transaction_type': 'credit',
                columnNumber: 15
            }];

            let transaction = new Transaction();

            let cells = require('./resources/transaction-google-cells');

            let results = await transaction.insertTransactionsIntoCells(newTransactions, cells);

            let htmlData = await transaction.generateTransactionLogHTML(results);

            expect(htmlData).toBeTruthy();

        });

        it('Should properly update transactions', async () => {

            let newTransactions = [{
                'merchant_name': 'EDWARD JONES',
                'amount': 200.00,
                'category': 'Investments',
                'date': '07/20/2019',
                'description': 'EDWARD JONES DES:INVESTMENT ID:12345 721813321 INDN:JANE DOE CO ID:XXXXX44444 PPD',
                'transaction_type': 'checking',
                columnNumber: 24
            }, {
                'merchant_name': 'VENMO',
                'amount': 50.29,
                'category': 'Cash, Checks & Misc: Other Expenses',
                'date': '07/11/2019',
                'description': 'VENMO 06/28 PURCHASE 855-812-4430 NY',
                'transaction_type': 'checking',
                columnNumber: 48
            }, {
                'merchant_name': 'CHEVRON',
                'amount': 44.23,
                'category': 'Transportation: Gasoline/Fuel',
                'date': '07/21/2019',
                'description': 'CHEVRON 0095006 TAHOE PARADISCA',
                'transaction_type': 'credit',
                columnNumber: 33
            }, {
                'merchant_name': '76 - DBA T.B.D.J INC',
                'amount': 46.38,
                'category': 'Transportation',
                'date': '07/06/2019',
                'description': '76 - DBA T.B.D.J INC NEW YORK CA',
                'transaction_type': 'credit',
                columnNumber: 33
            }, {
                'merchant_name': 'SUR LA TABLE',
                'amount': 9.94,
                'category': 'Home',
                'date': '07/14/2019',
                'description': 'SUR LA TABLE LOS GATOS LOS GATOS CA',
                'transaction_type': 'credit',
                columnNumber: 45
            }, {
                'merchant_name': 'TJ MAXX',
                'amount': 176.48,
                'category': 'Home',
                'date': '07/13/2019',
                'description': 'TJMAXX #0628 NEW YORK CA',
                'transaction_type': 'credit',
                columnNumber: 45
            },
                {
                    'merchant_name': 'YMCA',
                    'amount': 79.00,
                    'category': 'Gym',
                    'date': '07/13/2019',
                    'description': 'YMCA NEW YORK CA',
                    'transaction_type': 'credit',
                    columnNumber: 15
                }];

            let transaction = new Transaction();

            let cells = require('./resources/transaction-google-cells');

            await transaction.insertTransactionsIntoCells(newTransactions, cells);

            for (let i = 0; i < newTransactions.length; i++) {
                expect(transaction.uniqueTransaction(newTransactions[i], cells)).toEqual(false);
            }

        });

    });

    describe('appendColumn Method', () => {

        it('Should properly append column', async () => {

            let categorizedTransactions = [
                {
                    merchant_name: 'PACIFIC GAS AND ELECTRIC',
                    amount: '-41.60',
                    category: 'Utilities',
                    date: '07/02/2019',
                    description:
                        'PGANDE DES:WEB ONLINE ID:XXXXX811063019 INDN:ERICK SHAFFER CO ID:XXXXX42640 WEB',
                    transaction_type: 'checking'
                },
                {
                    merchant_name: 'FEDLOAN SERVICING',
                    amount: '-4,957.54',
                    category: 'Student Loans',
                    date: '07/02/2019',
                    description:
                        'FEDLOANSERVICING DES:STDNT LOAN ID:6NCF2VCSKB1 INDN:ERICK SHAFFER CO ID:XXXXX00802 WEB',
                    transaction_type: 'checking'
                },
                {
                    merchant_name: 'RIDGE VINEYARDS - MONTEB',
                    amount: '$30.00',
                    category: 'Entertainment',
                    date: '07/09/2019',
                    description: 'RIDGE VINEYARDS - MONTEBNEW YORK CA',
                    transaction_type: 'credit'
                },
                {
                    merchant_name: 'Audible US*MH2BQ60Y2',
                    amount: '$14.95',
                    category: 'Subscriptions',
                    date: '07/08/2019',
                    description: 'Audible US*MH2BQ60Y2 888-283-5051 NJ',
                    transaction_type: 'credit'
                },
                {
                    merchant_name: 'PIZZERIA VENTI',
                    amount: '$122.25',
                    category: 'Restaurants & Dining',
                    date: '07/06/2019',
                    description: 'PIZZERIA VENTI MOUNTAIN VIEWCA',
                    transaction_type: 'credit'
                },
                {
                    merchant_name: 'YMCA',
                    amount: '$79.00',
                    category: 'Gym',
                    date: '07/23/2019',
                    description: 'YMCA SILICON VALLEY-AO DR408-3516473 CA',
                    transaction_type: 'credit'
                }];

            let transaction = new Transaction();

            transaction.appendColumn(categorizedTransactions);

            expect(categorizedTransactions[0].columnNumber).toEqual(12);
            expect(categorizedTransactions[1].columnNumber).toEqual(42);
            expect(categorizedTransactions[2].columnNumber).toEqual(6);
            expect(categorizedTransactions[3].columnNumber).toEqual(30);
            expect(categorizedTransactions[4].columnNumber).toEqual(21);
            expect(categorizedTransactions[5].columnNumber).toEqual(15);

        });

    });

    describe('formatAmount Method', () => {

        it('Should leave credit negative', () => {

            let transactionList = [
                {
                    merchant_name: 'PACIFIC GAS AND ELECTRIC',
                    amount: '-41.60',
                    category: 'Utilities',
                    date: '07/02/2019',
                    description:
                        'PGANDE DES:WEB ONLINE ID:XXXXX811063019 INDN:ERICK SHAFFER CO ID:XXXXX42640 WEB',
                    transaction_type: 'credit'
                }];

            let transaction = new Transaction();

            transaction.formatAmount(transactionList);

            expect(transactionList[0].amount).toEqual('-41.60');

        });

        it('Should make checking positive', () => {

            let transactionList = [
                {
                    merchant_name: 'PACIFIC GAS AND ELECTRIC',
                    amount: '-41.60',
                    category: 'Utilities',
                    date: '07/02/2019',
                    description:
                        'PGANDE DES:WEB ONLINE ID:XXXXX811063019 INDN:ERICK SHAFFER CO ID:XXXXX42640 WEB',
                    transaction_type: 'checking'
                }];

            let transaction = new Transaction();

            transaction.formatAmount(transactionList);

            expect(transactionList[0].amount).toEqual('41.60');

        });

        it('Should remove commas and dollar signs', () => {

            let transactionList = [
                {
                    merchant_name: 'PACIFIC GAS AND ELECTRIC',
                    amount: '1,141.60',
                    category: 'Utilities',
                    date: '07/02/2019',
                    description:
                        'PGANDE DES:WEB ONLINE ID:XXXXX811063019 INDN:ERICK SHAFFER CO ID:XXXXX42640 WEB',
                    transaction_type: 'credit'
                }];

            let transaction = new Transaction();

            transaction.formatAmount(transactionList);

            expect(transactionList[0].amount).toEqual('1141.60');

        });

        it('Should remove commas and dollar signs', () => {

            let transactionList = [
                {
                    merchant_name: 'PACIFIC GAS AND ELECTRIC',
                    amount: '$22,222.60',
                    category: 'Utilities',
                    date: '07/02/2019',
                    description:
                        'PGANDE DES:WEB ONLINE ID:XXXXX811063019 INDN:ERICK SHAFFER CO ID:XXXXX42640 WEB',
                    transaction_type: 'credit'
                }];

            let transaction = new Transaction();

            transaction.formatAmount(transactionList);

            expect(transactionList[0].amount).toEqual('22222.60');

        });

    });

    describe('compare Method', () => {

        let row = [' ', ' ', ' ', '07/05/2019', 'Check', '3495', ' ', ' ', ' ', ' ', ' ', ' ', '07/02/2019', 'PACIFIC GAS AND ELECTRIC', '41.6', ' ', ' ', ' ', ' ', ' ', ' ', '07/06/2019', 'PIZZERIA VENTI', '122.25', '07/01/2019', 'EDWARD JONES', '200', '07/08/2019', 'Check', '325', '07/08/2019', 'Audible US*MH2BQ60Y2', '14.95', '07/09/2019', 'CHEVRON', '43.23', ' ', ' ', ' ', ' ', ' ', ' ', '07/02/2019', 'FEDLOAN SERVICING', '4957.54', '07/04/2019', 'SUR LA TABLE', '9.94', '07/08/2019', 'VENMO', '59'];

        it('should return true when transaction exists', () => {

            let duplicateTransaction = {
                merchant_name: 'PACIFIC GAS AND ELECTRIC',
                amount: 41.60,
                category: 'Utilities',
                date: '07/02/2019',
                description:
                    'PGANDE DES:WEB ONLINE ID:XXXXX811063019 INDN:ERICK SHAFFER CO ID:XXXXX42640 WEB',
                transaction_type: 'credit',
                columnNumber: 12
            };

            let transaction = new Transaction();

            let result = transaction.compare(row, duplicateTransaction);

            expect(result).toEqual(true);

        });

        it('should return false when transaction unique', () => {

            let uniqueTransaction = {
                merchant_name: 'PACIFIC GAS AND ELECTRIC',
                amount: 41.50,
                category: 'Utilities',
                date: '07/21/2019',
                description:
                    'PGANDE DES:WEB ONLINE ID:XXXXX811063019 INDN:ERICK SHAFFER CO ID:XXXXX42640 WEB',
                transaction_type: 'credit',
                columnNumber: 12
            };


            let transaction = new Transaction();

            let result = transaction.compare(row, uniqueTransaction);

            expect(result).toEqual(false);

        });

        it('should return true when transaction exists', () => {

            let duplicateTransaction = {
                merchant_name: 'Check',
                amount: 3495,
                category: 'Rent',
                date: '07/05/2019',
                description: 'check',
                transaction_type: 'checking',
                columnNumber: 3
            };

            let transaction = new Transaction();

            let result = transaction.compare(row, duplicateTransaction);

            expect(result).toEqual(true);

        });

        it('should return false when transaction is unique', () => {

            let uniqueTransaction = {
                merchant_name: 'Check',
                amount: 3495,
                category: 'Rent',
                date: '07/21/2019',
                description: 'check',
                transaction_type: 'checking',
                columnNumber: 3
            };

            let transaction = new Transaction();

            let result = transaction.compare(row, uniqueTransaction);

            expect(result).toEqual(false);

        });

    });

    describe('uniqueTransaction Method', () => {

        let cells = require('./resources/transaction-google-cells');

        it('should return false when transaction exists', () => {

            let duplicateTransaction = {
                merchant_name: 'Check',
                amount: 3495,
                category: 'Rent',
                date: '07/05/2019',
                description: 'check',
                transaction_type: 'checking',
                columnNumber: 3
            };


            let transaction = new Transaction();

            let result = transaction.uniqueTransaction(duplicateTransaction, cells);

            expect(result).toEqual(false);

        });

        it('should return true when transaction is unique', () => {

            let uniqueTransaction = {
                merchant_name: 'Check',
                amount: 3496.00,
                category: 'Rent',
                date: '07/25/2019',
                description:
                    'check',
                transaction_type: 'checking',
                columnNumber: 3
            };


            let transaction = new Transaction();

            let result = transaction.uniqueTransaction(uniqueTransaction, cells);

            expect(result).toEqual(true);

        });

    });

    describe('inputTransactionIntoRow Method', () => {

        let cells = require('./resources/transaction-google-cells');

        it('should insert transaction into cells', () => {

            let uniqueTransaction = {
                merchant_name: 'Check',
                amount: 3495.00,
                category: 'Rent',
                date: '07/31/2019',
                description:
                    'check',
                transaction_type: 'checking',
                columnNumber: 3
            };

            let transaction = new Transaction();

            transaction.inputTransactionIntoRow(uniqueTransaction, cells);

            let result = transaction.uniqueTransaction(uniqueTransaction, cells);

            expect(result).toEqual(false);

        });

        it('should return list with one new transaction', () => {

            let uniqueTransaction = {
                merchant_name: 'Check',
                amount: 3495.00,
                category: 'Rent',
                date: '07/02/2019',
                description:
                    'check',
                transaction_type: 'checking',
                columnNumber: 3
            };

            let transaction = new Transaction();

            let result = transaction.inputTransactionIntoRow(uniqueTransaction, cells);

            expect(result.open_cell).toEqual(true)

        });

    });

});
