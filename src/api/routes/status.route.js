const express = require('express');
const StatusService = require('../services/status.service.js');
const router = new express.Router();

/**
 * Get health status of the application.
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @param {Function} next - Express `next` function
 */
router.get('/', async (req, res, next) => {
    const options = {
    };

    try {
        const result = await StatusService.getAppStatus(options);
        res.status(result.status || 200).send(result.data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
