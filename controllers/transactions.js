// controllers/transactions.js
const Transactions = require('../models/transactions');
const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { creditAccount, debitAccount } = require('../utils/transactions');

const transfer = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { toUsername, fromUsername, amount, summary} = req.body;
        const reference = v4();
        if (!toUsername && !fromUsername && !amount && !summary) {
            return res.status(400).json({
                status: false,
                message: 'Please provide the following details: toUsername, fromUsername, amount, summary'
            })
        }

      const transferResult = await Promise.all([
        debitAccount(
          {amount, username:fromUsername, purpose:"transfer", reference, summary,
          trnxSummary: `TRFR TO: ${toUsername}. TRNX REF:${reference} `, session}),
        creditAccount(
          {amount, username:toUsername, purpose:"transfer", reference, summary,
          trnxSummary:`TRFR FROM: ${fromUsername}. TRNX REF:${reference} `, session})
      ]);

      const failedTxns = transferResult.filter((result) => result.status !== true);
      if (failedTxns.length) {
        const errors = failedTxns.map(a => a.message);
        await session.abortTransaction();
        return res.status(400).json({
            status: false,
            message: errors
        })
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        status: true,
        message: 'Transfer successful'
    })
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            status: false,
            message: `Unable to find perform transfer. Please try again. \n Error: ${err}`
        })
    }
}

module.exports = { transfer };
