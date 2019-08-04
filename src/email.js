const mailgun = require("mailgun-js");
const mg = process.env['MAILGUN_API_KEY'] ? mailgun({
    apiKey: process.env['MAILGUN_API_KEY'],
    domain: process.env['MAILGUN_DOMAIN']
}) : undefined;
const moment = require('moment');
import {Logger} from "./logger";

export class Email {

    constructor(params) {
        this.from = "boa-api<noreply@boa-api.com>";
        this.to = process.env['TO_EMAIL'];
        this.subject = params.subject + ' ' + moment().format('MM-DD-YY');
        this.html = params.html ? params.html : params.text;
        this.logger = new Logger();
        this.emailEnabled = !!(process.env['MAILGUN_API_KEY'] && process.env['MAILGUN_DOMAIN'])
    }

    async send() {

        if (!this.emailEnabled) {
            return 'Email not enabled'
        }

        const data = {
            from: this.from,
            to: this.to,
            subject: this.subject,
            html: this.html
        };

        await mg.messages().send(data, function (error, body) {
            if (error) {
                this.logger.log(error);
            }
            this.logger.log(body);
        });

    }

}
