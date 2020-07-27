const express = require('express');
const router = new express.Router();
const AuthorizationService = require('../services/authorization.service');

/**
 * Create an authorization token.
 */
router.post('/tokens', async (req, res, next) => {
    const options = {
        type: req.body.type || 'app.freshmanyr.auth',
        id: req.body.id
    };

    try {
        const data = await AuthorizationService.createAuthToken(options);
        res.status(201).send({
            entries: data.length,
            data
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Exchange a public token for an access token corresponding to a specified vendor API.
 */
router.get('/tokens/:id', async (req, res, next) => {
    const options = {
        vendorId: req.params.id || 'app.freshmanyr.auth',
        publicToken: req.query.public_token
    };

    try {
        const data = await AuthorizationService.getAccessToken(options);
        res.status(200).send({
            entries: data.length,
            data
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;