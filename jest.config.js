const nextJest = require('next/jest');
module.exports = nextJest({ dir: './' })({
  clearMocks: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
});
