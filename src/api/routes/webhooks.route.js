const express = require('express');
const router = new express.Router();
const cache = require('../../lib/cache');
const TransactionService = require('../services/transactions.service');


/**
 *  Notify availability of new transaction data.
 */
router.post('/plaid', async (req, res, next) => {
    const { item_id } = req.body;

    try {
        res.status(200).send();
        const transactions = await TransactionService.getUpdatedTransactions(item_id);
        const roundUps = await TransactionService.getTransactionRoundups(transactions);
        //Create Stripe charges for each amount in the list
        //roundUps.map((amt)=> new Chargeable(amt))
        //Promise.all(roundUps);

    } catch (err) {
        next(err);
    }
});

module.exports = router;
