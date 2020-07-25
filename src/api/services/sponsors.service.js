const Repository = require('../interfaces/Repository');
const libRepository = require('../../lib/repository');
const { getAllStudentsBySponsorId } = require('../../lib/extensions');
const repo = Object.assign(new Repository(libRepository), { getAllStudentsBySponsorId });
repo.connect({
    host: 'http://data_service:3000',
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
        connectionURI: 'http://data_service:3000/api/xjoin'
    }, id);
    return data;
}

module.exports = {
    updateSponsor,
    getAllSponsoredStudents
}