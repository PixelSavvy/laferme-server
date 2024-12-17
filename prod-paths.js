const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

const baseUrl = './dist';
console.log('Registering paths with baseUrl:', baseUrl);
console.log('Using paths:', tsConfig.compilerOptions.paths);

const cleanup = tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
});
