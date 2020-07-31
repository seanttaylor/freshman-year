const express = require('express');
const eventEmitter = require('../../lib/events');
const router = new express.Router();
const cache = require('../../lib/cache');
const TransactionService = require('../services/transactions.service');


/**
 * Notify availability of new transaction data.
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @param {Function} next - Express `next` function
 */
router.post('/plaid', async (req, res, next) => {
    const { item_id } = req.body;

    try {
        res.status(200).send();
        eventEmitter.emit('webhooks.transactionsUpdateAvailable', item_id);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
