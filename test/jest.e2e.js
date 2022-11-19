module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  setupFilesAfterEnv: ['./db.setup.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  }
};
