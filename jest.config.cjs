/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    clearMocks: true,
    watchman: false,
    moduleNameMapper: {
        '^@actions/core$': '<rootDir>/test/mocks/actions-core.js',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: {
                    types: ['jest', 'node'],
                },
            },
        ],
    },
};
