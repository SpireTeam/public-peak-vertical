const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
const corePro = require('../shared/helpers/core_pro');

const accounts = require('./resources/accounts');
const buckets = require('./resources/buckets');
const transfers = require('./resources/transfers');

const app = express();

app.use(bodyParser.json());
app.use(auth);

app.get('/', (req, res) => {
  corePro.healthcheck().then((body) => {
    res.json({ status: 'ok', body });
  });
});

app.get('/accounts_summary', (req, res) => {
  accounts
    .summary(req.customer_id)
    .then((summary) => {
      res.json({ summary });
    })
    .catch((err) => {
      console.error(err.stack || err);
      res.status(400).json({ error: { code: 400, message: 'Bad Request'} });
    });
});

app.get('/checking', (req, res) => {
  accounts
    .checking(req.customer_id)
    .then((account) => {
      res.json({ account });
    })
    .catch((err) => {
      console.error(err.stack || err);
      res.status(400).json({ error: { code: 400, message: 'Bad Request'} });
    });
});

app.get('/savings', (req, res) => {
  accounts
    .savings(req.customer_id)
    .then((savings) => {
      res.json({ accounts: savings });
    })
    .catch((err) => {
      console.error(err.stack || err);
      res.status(400).json({ error: { code: 400, message: 'Bad Request'} });
    });
});

app.post('/buckets', (req, res) => {
  buckets
    .create(req.customer_id, req.body)
    .then((bucket) => {
      res.json({ bucket });
    })
    .catch((err) => {
      console.error(err.stack || err);
      res.status(400).json({ error: { code: 400, message: 'Bad Request' } });
    });
});

app.post('/transfers', (req, res) => {
  transfers
    .create(req.customer_id, req.body)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err.stack || err);
      res.status(400).json({ error: { code: 400, message: 'Bad Request' } });
    });
});

module.exports = app;