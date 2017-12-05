const dotenv = require('dotenv');
const env = process.env.NODE_ENV || 'development';
const codeEnv = process.env.CODE_ENV || env;
// Load ENV specific
dotenv.config({
  path: `.env.${env}`,
  silent: true,
});

// Load Defaults
dotenv.config({
  silent: true,
});

module.exports = {
  env,
  codeEnv,
  api: {
    core_pro: {
      auth: `${process.env.CORE_PRO_CLIENT_ID}:${process.env.CORE_PRO_CLIENT_SECRET}`,
      host: process.env.CORE_PRO_HOST,
    },
    mysql: {
      host: process.env.API_MYSQL_HOST,
      user: process.env.API_MYSQL_USER,
      password: process.env.API_MYSQL_PASSWORD,
      database: process.env.API_MYSQL_DATABASE,
      timezone: 'Z',
      charset: 'utf8mb4',
    },
  },
};
