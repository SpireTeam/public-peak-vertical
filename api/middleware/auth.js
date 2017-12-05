const auth = require('basic-auth');
const { knex } = require('../../shared');
const pw = require('../../shared/helpers/pw');

const authenticate = async function authenticate(credentials) {
  if (!credentials) throw new Error('Unauthorized');

  const user = await knex('users')
    .where('username', credentials.name)
    .first();

  if (!user) throw new Error('User Not Found');

  const isValid = await pw.compare(user.crypted_password, credentials.pass);

  if (!isValid) throw new Error('Unauthorized');

  return user.customer_id;
};

module.exports = (req, res, next) => {
  const credentials = auth(req);

  authenticate(credentials)
    .then((customerId) => {
      req.customer_id = customerId;

      next();
    })
    .catch((err) => {
      process.stderr.write(`\nError: ${err.toString()}\n`);
      res.status(401).json({ error: { code: 401, message: 'Unauthorized' } });
    });
};