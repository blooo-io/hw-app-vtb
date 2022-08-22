export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: ".test.ts$",
  collectCoverage: true,
  testPathIgnorePatterns: ["/*/lib-es", "/*/lib"],
  coveragePathIgnorePatterns: ["packages/create-dapp"],
  passWithNoTests: true,
  rootDir: __dirname,
};
