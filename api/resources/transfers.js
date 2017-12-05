const corePro = require('../../shared/helpers/core_pro');

module.exports = {};

module.exports.create = async function transfersCreate(customerId, params) {
  if (!customerId) throw new Error('customerId is required');

  const opts = {
    customerId,
    fromId: params.from_id,
    toId: params.to_id,
    amount: params.amount,
    nachaDescription: 'Peak Transfer',
  };

  await corePro.transfers.create(opts);

  return { status: 'ok' };
};