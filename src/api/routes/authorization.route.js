const express = require('express');
const router = new express.Router();
const AuthorizationService = require('../services/authorization.service');

/**
 * Create an authorization token.
 */
router.post('/tokens', async (req, res, next) => {
    const options = {
        type: req.body.type || 'app.freshmanyr.auth',
        id: req.boy.id
    };

    try {
        const result = await AuthorizationService.createAuthToken(options);
        res.status(201).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;