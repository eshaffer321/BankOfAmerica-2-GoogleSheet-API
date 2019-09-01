import {Logger} from './logger';

require('dotenv').config();

const app = require('./app');

const port = process.env.PORT;

const logger = new Logger();

app.listen(port, () => logger.log({
	level: 'info',
	message: 'Listening on port ${port}'
}));
