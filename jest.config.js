module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'controller/**/*.js',
    'services/**/*.js',
    'middleware/**/*.js',
    'validation/**/*.js',
    '!**/node_modules/**',
    '!coverage/**'
  ],
  testTimeout: 30000,
  verbose: true
};