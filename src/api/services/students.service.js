const apiResponse = require('../../lib/api-response');
const Mailable = require('../interfaces/Mailable');
const Templatable = require('../interfaces/Templatable');
const Repository = require('../interfaces/Repository');
const libMailable = require('../../lib/mailable');
const libTemplatable = require('../../lib/templatable');
const libRepository = require('../../lib/repository');
const myMailer = new Mailable(libMailable);
const template = new Templatable(libTemplatable);
const studentSponsorsRepo = new Repository(libRepository);
studentSponsorsRepo.connect({
    host: 'http://data_service:3000',
    defaultPath: '/api/student_sponsors'
});

/**
 * @param {String} studentId - Id of student receiving new sponsorship
 * @param {String} sponsorId - Id of sponsor granting sponsorship
 * @return {Object}
 */

async function addSponsor({ studentId: student_id, sponsorId: sponsor_id }) {
    await studentSponsorsRepo.addOne({ student_id, sponsor_id });
    console.log(`sending email to student: ${student_id} and sponsor: ${sponsor_id}`);
    return {
        student_id,
        sponsor_id
    }
}

module.exports = {
    addSponsor
}