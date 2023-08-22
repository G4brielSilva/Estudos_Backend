module.exports = {
    clearMocks: true,
    roots: ['<rootDir>/src'],
    collectCoverageFrom: ['<rootDir>/src/**/*ts', '!<rootDir>/src/**/*.protocols.ts', '!<rootDir>/src/**/index.ts', '!<rootDir>/src/main/server.ts'],
    coverageDirectory: 'coverage',
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '.+\\test.ts$': 'ts-jest'
    }
};