const mg = require('mailgun-js');
jest.genMockFromModule('mailgun-js');
module.exports = mg;