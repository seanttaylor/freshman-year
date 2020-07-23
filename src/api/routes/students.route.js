const express = require('express');
const schema = require('../schemas/students.schema.json');
const patchSchema = require('../schemas/students-patch.schema.json');
const ProfileService = require('../services/profiles.service');
const StudentService = require('../services/students.service');
const validateRequestBySchema = require('../../lib/middleware/validate.middleware.js');
const Entity = require('../../api/interfaces/Entity');
const proxy = require('../../lib/middleware/proxy');
const router = new express.Router();
const myValidationPipeline = [checkEmailExists, validateRequestBySchema(schema)];
const entityName = 'student';
proxy.addRoutes(ProfileService);

/**
 * Confirm an account email address is available for use
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @param {Function} next - Express `next` function
 */

async function checkEmailExists(req, res, next) {
    try {
        const addressAvailable = await ProfileService.isEmailAddressAvailable(req.body.emailAddress);
        if (!addressAvailable) {
            res.status(400).send({ message: 'Email already exists' });
            return;
        }
        next();
    } catch (err) {
        next(err);
    }
}

/**
 * Create new Student entity.
 */
router.post('/', checkEmailExists, validateRequestBySchema(schema), async (req, res, next) => {
    try {
        req.body = new Entity({ name: entityName, data: req.body });
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * Update an existing Student entity.
 */
router.patch('/:id', checkEmailExists, validateRequestBySchema(patchSchema), async (req, res, next) => {

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
 * Add a Sponsor for an existing Student
 */
router.post('/:id/sponsors', async (req, res, next) => {
    const studentId = req.params.id;
    const sponsorId = req.body.sponsorId;

    try {
        await StudentService.addSponsor({ studentId, sponsorId });
        res.status(201).send();

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
