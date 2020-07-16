const express = require('express');
const schema = require('../schemas/sponsors.schema.json');
const Sponsor = require('../services/sponsors.service.js');
const validateRequestBySchema = require('../../lib/middleware/validate.middleware.js');
const router = new express.Router();
//Applied to all routes by default. Use the validateRequestBySchema middleware to validate incoming [POST] and [PUT] requests where appropriate.
//router.use(validateRequestBySchema(schema));


/**
 * Create new sponsor entity.
 */
router.post('/', validateRequestBySchema(schema), async (req, res, next) => {
    const options = {
        body: req.body
    };

    try {
        req.body = Object.assign({}, new Sponsor(options.body).toJSON());
        //req.__useDefaultProxyBasePath = false;
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * Get all Sponsor entities from the data store.
 */
router.get('/', async (req, res, next) => {

    try {
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * Update an existing post.
 */
router.put('/:id', async (req, res, next) => {
    const options = {
        body: req.body,
        id: req.params['id']
    };

    try {
        const result = await posts.updatePost(options);
        res.status(200).send(result.data);
    } catch (err) {
        next(err);
    }
});

/**
 * Find a single post document by its UUID.
 */
router.get('/:id', async (req, res, next) => {
    const options = {
        id: req.params['id']
    };

    try {
        const result = await posts.findPostById(options);
        res.status(result.status || 200).send(result.data);
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
