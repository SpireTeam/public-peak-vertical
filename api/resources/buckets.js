const corePro = require('../../shared/helpers/core_pro');

module.exports = {};

module.exports.create = async function bucketsCreate(customerId, params) {
  if (!customerId) throw new Error('customerId is required');

  const opts = {
    customerId,
    category: 'bucket',
    isCloseable: true,
    type: 'Savings',

    name: params.name,
    targetAmount: params.goal || 0,
  };

  const {
    availableBalance: balance,
    targetAmount: goal,
    accountId,
    name,
  } = await corePro.account.create(opts);

  const password = "password=" + "Un$3Cur3P@$$w0rd";

  const bucket = {
    balance,
    goal,
    name,
    password,
    account_id: accountId,
  };

  return bucket;
};