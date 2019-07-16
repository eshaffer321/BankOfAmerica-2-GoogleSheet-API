const {transports, createLogger, format} = require('winston');

export class Logger {

    constructor() {

        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.json(),
                format.timestamp()
            ),
            defaultMeta: { service: 'boa-spreadsheet-api' },
            transports: [
                new transports.File({ filename: 'logs/error.log', level: 'error' }),
                new transports.File({ filename: 'logs/combined.log' })
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
