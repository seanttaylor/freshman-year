const express = require('express');
const schema = require('../schemas/sponsors.schema.json');
const SponsorService = require('../services/sponsors.service');
const validateRequestBySchema = require('../../lib/middleware/validate.middleware.js');
const proxy = require('../../lib/middleware/proxy');
const router = new express.Router();

/**
 * Create new Sponsor entity.
 */
router.post('/', validateRequestBySchema(schema), async (req, res, next) => {
    const options = {
        body: req.body
    };

    try {
        req.body = SponsorService.create(options.body);
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * Update an existing Sponsor entity.
 */
router.put('/:id', async (req, res, next) => {
    const options = {
        body: req.body,
        id: req.params['id']
    };

    try {
        req.body = Object.assign({
            lastModifiedAt: new Date().toISOString(),
        }, new Entity({
            name: 'sponsor',
            data: options.body
        }));
        next();
    } catch (err) {
        next(err);
    }
});


/**
 * Delete an existing post.
 */
router.delete('/:id', async (req, res, next) => {
    const options = {
        id: req.params['id']
    };

    try {
        const result = await posts.deletePost(options);
        res.status(200).send(result.data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
