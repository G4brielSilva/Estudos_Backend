// eslint-disable-next-line @typescript-eslint/no-var-requires, import/extensions
const config = require('./jest.config');

config.testMatch = ['**/*.spec.ts'];

module.exports = config;
