const rules = require('../static/rules');

export class Category {
	constructor(props) {
	}

	categorize(transactions) {
		const self = this;
		transactions.forEach(transaction => {
			rules.forEach(rule => {
				if (rule.merchantName === 'VENMO') {
					self.categorizeVenmo(transaction);
				} else {
					self.categorizeItem(rule, transaction);
				}
			});
		});
	}

	categorizeItem(rule, transaction) {
		const regex = new RegExp(rule.expression);
		const result = regex.test(transaction[rule.properties_to_match[0]]);
		if (result) {
			transaction.category = rule.updated_values.category;
		}
	}

	categorizeVenmo(transaction) {
		transaction.amount.replace(',', '').replace('$', '').replace('-', '');

		if (!transaction.is_updated_venmo) {
			if (transaction.amount > 0) {
				transaction.category = 'Income';
			} else {
				transaction.is_updated_venmo = 1;
				transaction.category = 'Other';
			}
		}
	}
}
