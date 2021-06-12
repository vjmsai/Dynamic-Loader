const { jestConfig } = require('add jest config');

customConfig = {
  roots: ['<rootDir>'],
  collectCoverageFrom: [
    '<rootDir>/components/**/src/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/components/**/src/**/*.d.ts',
    '<rootDir>/components/**/src/**/*css.ts',
  ],
  testMatch: [
    '<rootDir>/components/**/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/components/**/src/**/*.{spec,test,axe}.{js,jsx,ts,tsx}',
  ],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './jest-html-report',
      },
    ],
  ],
};

module.exports = jestConfig(customConfig);