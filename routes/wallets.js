// routes/wallets.js
const express = require('express');
const router = express.Router();

const Wallets = require('../controllers/wallets');

router.post('/', Wallets.createWallet);

module.exports = router;
