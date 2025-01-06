// server/config/validateEnv.js
const { cleanEnv, str } = require('envalid');

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: str(),
    JWT_SECRET: str(),
    ENCRYPTION_KEY: str({ length: 64, matches: /^[0-9a-fA-F]+$/ }),
    MONGO_URI: str(),
  });
}

module.exports = validateEnv;
