const https = require('https');
const config = require('../config');

const base = (path = '/', method = 'GET', params) => {
  const options = {
    method,
    path,
    auth: config.api.core_pro.auth,
    hostname: config.api.core_pro.host,
  };

  let postData;
  if (params) {
    postData = JSON.stringify(params);

    options.headers = {
      'Content-Type': 'application/json',
    };
  }

  return new Promise((resolve, reject) => {
    const buffers = [];
    const strings = [];
    let bufferLength = 0;
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      
      res.on('data', (chunk) => {
        if (!Buffer.isBuffer(chunk)) {
          strings.push(chunk);
        } else if (chunk.length) {
          bufferLength += chunk.length;
          buffers.push(chunk);
        }
      });

      res.on('end', () => {
        if (bufferLength) {
          resolve(Buffer.concat(buffers, bufferLength).toString('utf8'));
        } else if (strings.length) {
          resolve(strings.join(''));
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(postData);
    }

    req.end();
  })
  .then(res => JSON.parse(res))
  .then(res => {
    if (res.status !== 200 && res.status !== 201) {
      if (res.errors && res.errors.length > 0) {
        throw new Error(res.errors[0].message);
      }
      console.error(res);
      throw new Error('Bad Request');
    }
    return res.data;
  });
};

const account = {
  create: params => base('/account/create', 'POST', params),
  get: (customerId, accountId) => base(`/account/get/${customerId}/${accountId}`),

  external: {
    create: params => base('/externalAccount/create', 'POST', params),
  },
};

const customer = {
  accounts: customerId => base(`/account/list/${customerId}`),
  get: customerId => base(`/customer/get/${customerId}`),
  initiate: params => base('/customer/initiate', 'POST', params),
  verify: params => base('/customer/verify', 'POST', params),
};

const transactions = {
  list: (customerId, accountId) => base(`/transaction/list/${customerId}/${accountId}`),
};

const transfers = {
  create: params => base('/transfer/create', 'POST', params),
};

module.exports = {
  healthcheck: base,

  account,
  customer,
  transactions,
  transfers,
};