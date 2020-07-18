const express = require('express');
const schema = require('../schemas/students.schema.json');
const patchSchema = require('../schemas/students-patch.schema.json');
const StudentService = require('../services/students.service');
const validateRequestBySchema = require('../../lib/middleware/validate.middleware.js');
const router = new express.Router();

/**
 * Create new Student entity.
 */
router.post('/', validateRequestBySchema(schema), async (req, res, next) => {
    const options = {
        body: req.body
    };

    try {
        req.body = StudentService.create(options.body);
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * Update an existing Student entity.
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
