import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest', 
  testEnvironment: 'node', 
  testMatch: ['<rootDir>/src/**/*.test.ts'], 
  moduleNameMapper: {
  },
  setupFiles: ['dotenv/config'], 
  collectCoverage: true, 
  coverageDirectory: 'coverage', 
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  verbose: true, 
};

export default config;