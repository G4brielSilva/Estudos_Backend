// eslint-disable-next-line @typescript-eslint/no-var-requires, import/extensions
const config = require('./jest.config');

config.testMatch = ['**/*.test.ts'];

module.exports = config;
