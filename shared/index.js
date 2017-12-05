module.exports = {};

module.exports.config = require('./config');

const knexfile = require('../knexfile');
module.exports.knex = require('knex')(knexfile);