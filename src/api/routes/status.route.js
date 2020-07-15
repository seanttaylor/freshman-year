const express = require('express');
const health = require('../services/status.service.js');
const router = new express.Router();

/**
 * Get health status of the application.
 */
router.get('/', async (req, res, next) => {
    const options = {
    };

    try {
        const result = await health.getAppStatus(options);
        res.status(result.status || 200).send(result.data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
