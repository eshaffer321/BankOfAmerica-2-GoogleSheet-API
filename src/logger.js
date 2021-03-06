const {transports, createLogger, format} = require('winston');
require('winston-daily-rotate-file');
const moment = require('moment');

export class Logger {
	constructor() {
		const transport = new (transports.DailyRotateFile)({
			filename: 'boa-api.log',
			dirname: 'var/log',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '1m'
		});

		this.logger = createLogger({
			level: 'info',
			format: format.combine(
				format.json(),
				format.timestamp()
			),
			defaultMeta: {service: 'boa-spreadsheet-api',
				timestamp: moment().format()},
			transports: [
				transport
			]
		});

		if (process.env.NODE_ENV !== 'production') {
			this.logger.add(new transports.Console({
				format: format.simple()
			}));
		}
	}

	log(params) {
		this.logger.log(params);
	}
}
