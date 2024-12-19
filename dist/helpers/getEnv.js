'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getEnvVar = void 0;
require('dotenv/config');
const getEnvVar = (name, defaultValue) => {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};
exports.getEnvVar = getEnvVar;
//# sourceMappingURL=getEnv.js.map
