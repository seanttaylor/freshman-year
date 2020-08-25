const Repository = require('../interfaces/Repository');
const libRepository = require('../../lib/repository');
const libTransformable = require('../../lib/transformable');
const Transformable = require('../interfaces/Transformable');
const transformable = new Transformable(libTransformable);
const { getAllStudentsBySponsorId } = require('../../lib/mixins');
const { entityURI, defaults } = require('../../config/main.json');
const repo = Object.assign(new Repository(libRepository), { getAllStudentsBySponsorId });
repo.connect({
    host: `${process.env.DATA_SERVICE_HOST}`,
    defaultPath: '/api/sponsors'
});

/** Update an existing `sponsor` entity
 * @param {String} id - uuid of the student to update
 * @param {Object} update - fields to update on the `student` entity
 * @return {Object}
 */

async function updateSponsor(id, update) {
    await repo.updateOne(id, update);
    return [{ id, href: `/api/sponsors/${id}` }]
}


/** Get all students receiving contributions from a specified sponsor
 * @param {String} id - uuid of the sponsor to fetch students of
 * @return {Object}
 */

async function getAllSponsoredStudents(id) {
    const data = await repo.getAllStudentsBySponsorId.call({
        connectionURI: `${process.env.DATA_SERVICE_HOST}/api/xjoin`
    }, id);
    return data.map((record) => transformable.of({ type: 'profile' }, record));
}

/** Get all Sponsors
 * @return {Object}
 */

async function getAllSponsors() {
    const data = await repo.findAll.call({
        connectionURI: `${process.env.DATA_SERVICE_HOST}${entityURI['sponsor']}`
    });

    return data;
}

/** Get Sponsor by id
 * @param {String} id - uuid of the Sponsor
 * @return {Object}
 */

async function getSponsorById(id) {
    const data = await repo.findOne.call({
        connectionURI: `${process.env.DATA_SERVICE_HOST}${entityURI['sponsor']}`
    }, id);

    return data;
}

module.exports = {
    updateSponsor,
    getAllSponsoredStudents,
    getSponsorById,
    getAllSponsors
}