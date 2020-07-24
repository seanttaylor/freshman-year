const express = require('express');
const schema = require('../schemas/students.schema.json');
const patchSchema = require('../schemas/students-patch.schema.json');
const ProfileService = require('../services/profiles.service');
const StudentService = require('../services/students.service');
const validateRequestBySchema = require('../../lib/middleware/validate.middleware.js');
const Entity = require('../../api/interfaces/Entity');
const router = new express.Router();
const entityName = 'student';

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
        const myProfile = new Entity({ name: entityName, data: req.body });
        const data = await ProfileService.createProfile(myProfile);
        res.status(201).send({
            entries: data.length,
            data
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Update an existing Student entity.
 */
router.patch('/:id', checkEmailExists, validateRequestBySchema(patchSchema), async (req, res, next) => {
    const { id } = req.params;
    const myUpdate = Object.assign({
        lastModifiedAt: new Date().toISOString(),
    }, req.body);

    try {
        const data = await StudentService.updateStudent(id, myUpdate);
        res.status(200).send({
            entries: data.length,
            data
        });

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
        res.status(201).send({
            entries: 0,
            data: []
        });

    } catch (err) {
        next(err);
    }
});



module.exports = router;
