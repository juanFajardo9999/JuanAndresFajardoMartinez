module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/src/setup.jest.ts'],
    testPathIgnorePatterns: [
      "<rootDir>/node_modules/",
      "<rootDir>/dist/",
      "<rootDir>/src/test.ts",
    ],
    collectCoverage: true,
    collectCoverageFrom: [
      "src/**/*.ts",
      "!src/main.ts",
      "!src/polyfills.ts",
      "!src/**/*.module.ts",
      "!src/**/*.array.ts",
      "!src/**/*.model.ts",
      "!src/**/*.enum.ts"
    ],
    coverageReporters: ["html", "lcov", "text-summary"],
    coverageDirectory: "coverage/my-app"
  };