import {Logger} from './logger';

const mailgun = require('mailgun-js');

const mg = process.env.MAILGUN_API_KEY ? mailgun({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.MAILGUN_DOMAIN
}) : undefined;
const moment = require('moment');

export class Email {
	constructor(params) {
		this.from = 'boa-api<noreply@boa-api.com>';
		this.to = process.env.TO_EMAIL;
		this.subject = params.subject + ' ' + moment().format('MM-DD-YY');
		this.html = params.html ? params.html : params.text;
		this.logger = new Logger();
		this.emailEnabled = Boolean(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN);
	}

	async send() {
		if (!this.emailEnabled) {
			return 'Email not enabled';
		}

		const data = {
			from: this.from,
			to: this.to,
			subject: this.subject,
			html: this.html
		};

		try {
			await mg.messages().send(data);
		} catch (error) {
			this.logger.log('Error sending email: ' + error);
		}
	}
}
