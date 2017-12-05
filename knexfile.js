const config = require('./shared/config');

module.exports = {
  client: 'mysql',
  connection: config.api.mysql,
  migrations: {
    directory: `${__dirname}/db/migrations`,
  },
  seeds: {
    directory: `${__dirname}/db/seeds`,
  },
  debug: process.env.API_KNEX_DEBUG || false,
};
