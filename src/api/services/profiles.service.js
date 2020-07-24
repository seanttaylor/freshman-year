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
const { shortUUID, profiles } = require('../../lib/utilities');
const eventEmitter = require('../../lib/events');
const cache = require('../../lib/cache');
const findOneByEmail = profiles.findOneByEmail;
const profilesRepo = Object.assign(new Repository(libRepository), { findOneByEmail });
const entityURIMap = {
    'sponsor': 'http://data_service:3000/api/sponsors',
    'student': 'http://data_service:3000/api/students'
};
const activationsMap = {
    'sponsor': profilesRepo.updateOne.bind({ connectionURI: entityURIMap['sponsor'] }),
    'student': profilesRepo.updateOne.bind({ connectionURI: entityURIMap['student'] })
};
eventEmitter.on('activations.request-received', onActivationRequest);


/** 
 * @param {Object} profile - profile object containing user data
 * 
 */

async function createProfile(profile) {
    const connectionURI = entityURIMap[profile.entityName];
    await profilesRepo.addOne.call({ connectionURI }, profile);
    onCreateWelcomeEmail(profile);
    const data = await profilesRepo.findOne.call({ connectionURI }, profile.id);
    return data;
}

/**
* @param {Object} profile - all user profile data
* @returns {Object}
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
* Updates the profile's activation status on the `activations.request-received` event
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
 * @param {String} emailAddress 
 * @returns {Boolean}
 */
async function isEmailAddressAvailable(emailAddress) {
    const sponsorEmails = await profilesRepo.findOneByEmail.call({
        connectionURI: entityURIMap['sponsor']
    }, emailAddress);
    const studentEmails = await profilesRepo.findOneByEmail.call({
        connectionURI: entityURIMap['student']
    }, emailAddress);
    return sponsorEmails.length === 0 && studentEmails.length === 0;
}

module.exports = {
    isEmailAddressAvailable,
    createProfile
} 