const Repository = require('../interfaces/Repository');
const libRepository = require('../../lib/repository');
const repo = new Repository(libRepository);
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

module.exports = {
    updateSponsor
}