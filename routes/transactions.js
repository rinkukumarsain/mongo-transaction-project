// routes/transactions.js
const express = require('express');
const router = express.Router();

const Transactions = require('../controllers/transactions');

router.post('/transfer', Transactions.transfer);

module.exports = router;
