const apiResponse = require('../../lib/api-response');
const Mailable = require('../interfaces/Mailable');
const Templatable = require('../interfaces/Templatable');
const Repository = require('../interfaces/Repository');
const libMailable = require('../../lib/mailable');
const libTemplatable = require('../../lib/templatable');
const libRepository = require('../../lib/repository');
const emailTemplateMap = require('../../config/templates/templates.json');
const newSponsorshipTemplate = emailTemplateMap['sponsor']['newStudentSponsorship'];
const { profiles } = require('../../lib/utilities');
const myMailer = new Mailable(libMailable);
const template = new Templatable(libTemplatable);
const studentSponsorsRepo = new Repository(libRepository);
studentSponsorsRepo.connect({
    host: 'http://data_service:3000',
    defaultPath: '/api/student_sponsors'
});

/** Creates a new student sponsorship
 * @param {String} studentId - Id of student receiving new sponsorship
 * @param {String} sponsorId - Id of sponsor granting sponsorship
 * @return {Object}
 */

async function addSponsor({ studentId, sponsorId }) {
    const sponsorAddedOk = await studentSponsorsRepo.addOne({
        student_id: studentId,
        sponsor_id: sponsorId
    });

    if (!sponsorAddedOk) {
        throw 'Sponsor registration [FAILED]. See `data_service` logs for details.'
    }

    const [student] = await studentSponsorsRepo.findOne.call({
        connectionURI: 'http://data_service:3000/api/students'
    }, studentId);
    const [sponsor] = await studentSponsorsRepo.findOne.call({
        connectionURI: 'http://data_service:3000/api/sponsors'
    }, sponsorId);

    const myEmailTemplate = await template.of(newSponsorshipTemplate, {
        data: { student, sponsor }
    }).stamp();
    myMailer.useTemplate(myEmailTemplate);

    await myMailer.send({
        from: 'FreshmanYr Support <support@freshmanyr.io>',
        to: [student.emailAddress],
        subject: `You're now contributing to ${student.firstName}'s Scholar Fund!`
    });

    //eventEmitter.emit('students.newSponsorAdded', student);
}

module.exports = {
    addSponsor
}