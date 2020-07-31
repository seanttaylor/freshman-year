const Mailable = require('../interfaces/Mailable');
const Templatable = require('../interfaces/Templatable');
const Repository = require('../interfaces/Repository');
const libMailable = require('../../lib/mailable');
const libTemplatable = require('../../lib/templatable');
const libRepository = require('../../lib/repository');
const libTransformable = require('../../lib/transformable');
const emailTemplateMap = require('../../config/templates/templates.json');
const { entityURI, defaults } = require('../../config/main.json');
const newSponsorshipTemplate = emailTemplateMap['sponsor']['newStudentSponsorship'];
const { getAllSponsorsByStudentId } = require('../../lib/mixins');
const Transformable = require('../interfaces/Transformable');
const myMailer = new Mailable(libMailable);
const template = new Templatable(libTemplatable);
const transformable = new Transformable(libTransformable);
const repo = Object.assign(new Repository(libRepository), { getAllSponsorsByStudentId });
const studentsURI = `${process.env.DATA_SERVICE_HOST}${entityURI['student']}`;
const sponsorsURI = `${process.env.DATA_SERVICE_HOST}${entityURI['sponsor']}`;
repo.connect({
    host: `${process.env.DATA_SERVICE_HOST}`,
    defaultPath: entityURI['student_sponsor']
});

/** Creates a new student sponsorship
 * @param {String} studentId - Id of student receiving new sponsorship
 * @param {String} sponsorId - Id of sponsor granting sponsorship
 * @return {Object}
 */

async function addSponsor({ studentId, sponsorId }) {
    const sponsorAddedOk = await repo.addOne({
        student_id: studentId,
        sponsor_id: sponsorId
    });

    if (!sponsorAddedOk) {
        throw 'Sponsor registration [FAILED]. See `data_service` logs for details.'
    }

    const [student] = await repo.findOne.call({ connectionURI: studentsURI }, studentId);
    const [sponsor] = await repo.findOne.call({ connectionURI: sponsorsURI }, sponsorId);
    const myEmailTemplate = await template.of(newSponsorshipTemplate, {
        data: { student, sponsor }
    }).stamp();
    myMailer.useTemplate(myEmailTemplate);

    await myMailer.send({
        from: 'FreshmanYr Support <support@freshmanyr.io>',
        to: [sponsor.emailAddress],
        subject: `You're now contributing to ${student.firstName}'s Scholar Fund!`
    });

    //eventEmitter.emit('students.newSponsorAdded', student);
}


/** Update an existing `student` entity
 * @param {String} id - uuid of the student to update
 * @param {Object} update - fields to update on the `student` entity
 * @return {Object}
 */

async function updateStudent(id, update) {
    const record = await repo.updateOne.call({ connectionURI: studentsURI }, id, update);
    return [{ id, href: `${entityURI['student']}/${id}` }]
}

/** Get all sponsors contributing to a specified student
 * @param {String} id - uuid of the student fetch sponsors for
 * @return {Object}
 */

async function getAllStudentSponsors(id) {
    const data = await repo.getAllSponsorsByStudentId.call({
        connectionURI: `${process.env.DATA_SERVICE_HOST}/api/xjoin`
    }, id);

    return data.map((record) => transformable.of({ type: 'profile' }, record));
    //return data;
}

/** Get all Students
 * @return {Object}
 */

async function getAllStudents() {
    const data = await repo.findAll.call({
        connectionURI: `${process.env.DATA_SERVICE_HOST}${entityURI['student']}`
    });

    return data;
}

/** Get Student by id
 * @param {String} id - uuid of the Student
 * @return {Object}
 */

async function getStudentById(id) {
    const data = await repo.findOne.call({
        connectionURI: `${process.env.DATA_SERVICE_HOST}${entityURI['student']}`
    }, id);

    return data;
}


module.exports = {
    addSponsor,
    updateStudent,
    getAllStudentSponsors,
    getAllStudents,
    getStudentById
}