const express = require('express');
const schema = require('../schemas/sponsors.schema.json');
const patchSchema = require('../schemas/sponsors-patch.schema.json');
const validateRequestBySchema = require('../../lib/middleware/validate.middleware.js');
const Entity = require('../../api/interfaces/Entity');
const ProfileService = require('../services/profiles.service');
const SponsorService = require('../services/sponsors.service');
const router = new express.Router();
const entityName = 'sponsor';

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
 * Create new Sponsor entity.
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
 * Update an existing Sponsor entity.
 */
router.patch('/:id', checkEmailExists, validateRequestBySchema(patchSchema), async (req, res, next) => {

    const { id } = req.params;
    const myUpdate = Object.assign({
        lastModifiedAt: new Date().toISOString(),
    }, req.body);

    try {
        const data = await SponsorService.updateSponsor(id, myUpdate);
        res.status(200).send({
            entries: data.length,
            data
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Get all Students receiving sponsorship from a specified sponsor
 */
router.get('/:id/students', async (req, res, next) => {
    const sponsorId = req.params.id;

    try {
        const data = await SponsorService.getAllSponsoredStudents(sponsorId);
        res.status(200).send({
            entries: data.length,
            data
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router;
