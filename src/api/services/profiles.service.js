const apiResponse = require('../../lib/api-response');
const Mailable = require('../interfaces/Mailable');
const Templatable = require('../interfaces/Templatable');
const Repository = require('../interfaces/Repository');
const libMailable = require('../../lib/mailable');
const libTemplatable = require('../../lib/templatable');
const libRepository = require('../../lib/repository');
const myMailer = new Mailable(libMailable);
const template = new Templatable(libTemplatable);
const emailTemplateMap = require('../../config/templates/templates.json');
const { entityURI, defaults } = require('../../config/main.json');
const { shortUUID } = require('../../lib/utilities');
const { findOneBy } = require('../../lib/mixins');
const eventEmitter = require('../../lib/events');
const cache = require('../../lib/cache');
const repo = Object.assign(new Repository(libRepository), { findOneBy });
const studentsURI = `${process.env.DATA_SERVICE_HOST}${entityURI['student']}`;
const sponsorsURI = `${process.env.DATA_SERVICE_HOST}${entityURI['sponsor']}`;
const activationsMap = {
    'sponsor': repo.updateOne.bind({ connectionURI: sponsorsURI }),
    'student': repo.updateOne.bind({ connectionURI: studentsURI })
};
eventEmitter.on('activations.request-received', onActivationRequest);


/** 
 * Create a new user Profile
 * @param {Object} profile - Profile object containing user data
 */

async function createProfile(profile) {
    const connectionURI = `${process.env.DATA_SERVICE_HOST}${entityURI[profile.entityName]}`;
    await repo.addOne.call({ connectionURI }, profile);
    onCreateWelcomeEmail(profile);
    const data = await repo.findOne.call({ connectionURI }, profile.id);
    return data;
}

/**
 * Send a newly created user a welcome email
 * @param {Object} profile - user Profile data
 *
*/

async function onCreateWelcomeEmail(profile) {
    const csrf = shortUUID();
    const { entityName, id } = profile;
    const data = { ...profile, csrf };
    const welcomeEmail = emailTemplateMap[entityName]['welcomeEmail'];
    const myEmailTemplate = await template.of(welcomeEmail, { data }).stamp();
    myMailer.useTemplate(myEmailTemplate);

    try {
        await myMailer.send({
            from: 'FreshmanYr Support <support@freshmanyr.io>',
            to: [profile.emailAddress],
            subject: 'Welcome to FreshmanYR!'
        });
        cache.set({
            key: csrf,
            value: JSON.stringify({ csrf, entityName, id })
        });

    } catch (e) {
        console.error(e);
    }
}


/**
* Updates the Profile's activation status on the `activations.request-received` event
* @param {String} entity - entity type (e.g. `sponsor`, `student`)
* @param {String} csrf - CSRF token associated with activation
* @param {String} id - uuid of the sponsor requesting actviation
*/

async function onActivationRequest({ entityName, csrf, id }) {
    await activationsMap[entityName](id, { isAccountActivated: true });
    cache.delete(csrf);
}

/**
 * Checks for an existing emailAddress
 * @param {String} emailAddress - an email address
 * @returns {Boolean}
 */

async function isEmailAddressAvailable(emailAddress) {
    const sponsorEmails = await repo.findOneBy.call({
        connectionURI: sponsorsURI
    }, 'emailAddress', emailAddress);
    const studentEmails = await repo.findOneBy.call({
        connectionURI: studentsURI
    }, 'emailAddress', emailAddress);
    return sponsorEmails.length === 0 && studentEmails.length === 0;
}

module.exports = {
    isEmailAddressAvailable,
    createProfile
} 