import '@babel/polyfill';
import {Email} from '../src/email';
import {Logger} from '../src/logger';

jest.mock('../src/google');
jest.mock('../src/logger');

describe('Email Class', () => {
	describe('email constructor', () => {
		const OLD_ENV = process.env;

		beforeEach(() => {
			jest.resetModules();
			process.env = {...OLD_ENV};
			delete process.env.NODE_ENV;
		});

		afterEach(() => {
			process.env = OLD_ENV;
		});

		it('Should return that email isn\'t enabled when env vars are undefined', () => {
			process.env.MAILGUN_API_KEY = undefined;
			process.env.MAILGUN_DOMAIN = undefined;

			const email = new Email({subject: 'Test', text: 'Test'});

			expect(email.emailEnabled).toEqual(false);
		});

		it('Should have email enabled with api key', () => {
			process.env.MAILGUN_API_KEY = 'some-fake-api-key';
			process.env.MAILGUN_DOMAIN = 'example.relay.com';

			const email = new Email({subject: 'Test', text: 'Test'});

			expect(email.emailEnabled).toEqual(true);
		});
	});

	describe('send Method', () => {
		const OLD_ENV = process.env;

		beforeEach(() => {
			jest.resetModules();
			process.env = {...OLD_ENV};
			delete process.env.NODE_ENV;
		});

		afterEach(() => {
			process.env = OLD_ENV;
		});

		it('Should return that email isn\'t when env variables not set', async () => {
			process.env.MAILGUN_API_KEY = undefined;
			process.env.MAILGUN_DOMAIN = undefined;

			const email = new Email({subject: 'Test', text: 'Test'});

			const result = await email.send();

			expect(result).toEqual('Email not enabled');
		});

		it('Should send an email', async () => {
			process.env.MAILGUN_API_KEY = 'some-fake-api-key';
			process.env.MAILGUN_DOMAIN = 'example.relay';

			const email = new Email({subject: 'Test', text: 'Test'});

			expect(email.emailEnabled).toEqual(true);

			await email.send();
		});
	});
});
