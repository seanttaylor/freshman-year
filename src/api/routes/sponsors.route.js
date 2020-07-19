const express = require('express');
const schema = require('../schemas/sponsors.schema.json');
const patchSchema = require('../schemas/sponsors-patch.schema.json');
const SponsorService = require('../services/sponsors.service');
const validateRequestBySchema = require('../../lib/middleware/validate.middleware.js');
const Profile = require('../../lib/profile');
const proxy = require('../../lib/middleware/proxy');
const router = new express.Router();
const entityName = 'sponsor';
proxy.addRoutes(SponsorService);


/**
 * Create new Sponsor entity.
 */
router.post('/', validateRequestBySchema(schema), async (req, res, next) => {
    const options = {
        body: req.body
    };

    try {
        req.body = new Profile({ name: entityName, data: req.body });
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * Update an existing Sponsor entity.
 */
router.patch('/:id', validateRequestBySchema(patchSchema), async (req, res, next) => {
    const options = {
        body: req.body,
    };

    try {
        req.body = Object.assign({
            lastModifiedAt: new Date().toISOString(),
        }, req.body);

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
