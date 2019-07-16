require('dotenv').config();

const app = require('./app');
const port = process.env['PORT'];

import {Logger} from "./logger";

let logger = new Logger();

app.listen(port, () => logger.log({
    level: 'info',
    message: 'Listening on port ${port}'
}));
