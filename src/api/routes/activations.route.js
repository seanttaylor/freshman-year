const express = require('express');
const router = new express.Router();
const eventEmitter = require('../../lib/events');
const cache = require('../../lib/cache');


/**
 * Complete a pending activation.
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @param {Function} next - Express `next` function
 */
router.post('/:csrf', async (req, res, next) => {
    const { csrf } = req.params;
    try {
        if (cache.has(csrf)) {
            eventEmitter.emit('activations.request-received', JSON.parse(cache.get(csrf)));
            // eventually we will return a rendered HTML page with a success message
            res.status(204).send();
            return
        }
        res.status(403).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
