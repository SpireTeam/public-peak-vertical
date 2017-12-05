const corePro = require('../../shared/helpers/core_pro');
const { knex } = require('../../shared');

const requireCustomerId = function requireCustomerId(customerId) {
  if (!customerId) throw new Error('customerId is required');
};

const formatTransaction = function formatTransaction(trx) {
  return {
    action: /withdraw/i.test(trx.type) ? 'withdraw' : 'deposit',
    amount: trx.amount,
    description: trx.friendlyDescription,
    settled_date: trx.settledDate,
    is_credit: trx.isCredit,
  };
};

module.exports = {};

module.exports.checking = async function accountsChecking(customerId) {
  requireCustomerId(customerId);

  const { primary_account_id: accountId } = await knex('users')
    .pluck('primary_account_id')
    .where('customer_id', customerId)
    .first();

  const loadAccount = function loadAccount() {
    return corePro.account.get(customerId, accountId)
      .then(account => ({
        account_id: account.accountId,
        balance: account.availableBalance,
        name: account.name,
        transactions: [],
      }));
  };

  const loadTransactions = function loadTransactions() {
    return corePro.transactions.list(customerId, accountId)
      .then(transactions => transactions
        .map(trx => formatTransaction(trx)));
  };

  const [account, transactions] = await Promise.all([loadAccount(), loadTransactions()]);

  if (transactions && transactions.length > 0) {
    account.transactions = transactions;
  }

  return account;
};

module.exports.savings = async function accountsSavings(customerId) {
  if (!customerId) throw new Error('customerId is required');

  const accountList = await corePro.customer.accounts(customerId);

  const openAccounts = accountList
    .filter(account =>
      (account.type === 'Savings' && account.category === 'bucket' && account.status === 'Open'));

  const accountTransactions = await Promise
    .all(openAccounts.map(oa => corePro.transactions.list(customerId, oa.accountId)));

  const accounts = openAccounts.map((oa, index) => {
    const account = {
      account_id: oa.accountId,
      balance: oa.availableBalance,
      goal: oa.targetAmount || 1000,
      name: oa.name,
      transactions: [],
    };

    if (accountTransactions[index]) {
      account.transactions = accountTransactions[index]
        .map(trx => formatTransaction(trx));
    }

    return account;
  });

  return accounts;
};

module.exports.summary = async function accountsSummary(customerId) {
  if (!customerId) throw new Error('customerId is required');

  const { accounts } = await corePro.customer.get(customerId);

  const summary = {
    available: 0,
    safe_to_spend: 0,
    savings: 0,
  };

  accounts.forEach((account) => {
    if (account.category === 'primary') {
      summary.available = account.availableBalance;
    } else {
      summary.savings += account.availableBalance;
    }
  });

  summary.safe_to_spend = summary.available * 0.15;

  return summary;
};