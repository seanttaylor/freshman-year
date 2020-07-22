const apiResponse = require('../../lib/api-response');
const Mailable = require('../interfaces/Mailable');
const Templatable = require('../interfaces/Templatable');
const Repository = require('../interfaces/Repository');
const libMailable = require('../../lib/mailable');
const libTemplatable = require('../../lib/templatable');
const libRepository = require('../../lib/repository');
const myMailer = new Mailable(libMailable);
const template = new Templatable(libTemplatable);
const { shortUUID, profiles } = require('../../lib/utilities');
const eventEmitter = require('../../lib/events');
const cache = require('../../lib/cache');
const sponsorWelcomeEmail = '/app/src/lib/mailable/templates/test.ejs';
const studentWelcomeEmail = '/app/src/lib/mailable/templates/test-1.ejs';

//const ServiceResponse = require('../../lib/service-response'); 
const findOneByEmail = profiles.findOneByEmail;
const sponsorsRepo = Object.assign(new Repository(libRepository), { findOneByEmail });
const studentsRepo = Object.assign(new Repository(libRepository), { findOneByEmail });

sponsorsRepo.connect({ host: 'http://data_service:3000', defaultPath: '/api/sponsors' });
studentsRepo.connect({ host: 'http://data_service:3000', defaultPath: '/api/students' });
eventEmitter.on('activations.request-received', onActivationRequest);

const activationsMap = {
    'sponsor': sponsorsRepo.updateOne.bind(sponsorsRepo),
    'student': studentsRepo.updateOne.bind(studentsRepo)
};

const welcomeEmailsMap = {
    'sponsor': '/app/src/lib/mailable/templates/test.ejs',
    'student': '/app/src/lib/mailable/templates/test-1.ejs'
};

/**
 * The methods below apply formatting to records RETURNED from the data service.
 * The `express-http-proxy` package does not allow for easy post-processing of responses from
 * proxied API requests. The sole facility for achieving post-processing is through 
 * the user-configured `userResDecorator` method (see middleware/proxy/proxy-resolve.)
 */


/**
* Returns a specified entity according to the JSON Schema specfication in 
* the /schemas folder.
* @param {Object} proxyRes - proxied service's Express response object
* @param {Object} proxyResData - proxied service's Express response data *only*
* @param {Object} userReq - original Express request object
* @param {Object} userRes - original Express response object
* @returns {Object}
*/

async function onCreateProfile({ proxyRes, proxyResData, userReq, userRes }) {
    const csrf = shortUUID();
    const { entityName, id } = userReq.body;
    const myEmailTemplate = await template.of(welcomeEmailsMap[entityName], {
        data: {
            ...userReq.body,
            csrf
        }
    }).stamp();
    myMailer.useTemplate(myEmailTemplate);

    try {
        await myMailer.send({
            from: 'FreshmanYr Support <support@freshmanyr.io>',
            to: [userReq.body.emailAddress],
            subject: 'Welcome to FreshmanYR!'
        });
        cache.set({
            key: csrf,
            value: JSON.stringify({ csrf, entityName, id })
        });

    } catch (e) {
        console.error(e);
    }
    //new ServiceResponse(...arguments).onCreateEntityInstance();
    return apiResponse.onCreateEntityInstance({ proxyRes, proxyResData, userReq, userRes });
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
    const sponsorEmails = await sponsorsRepo.findOneByEmail(emailAddress);
    const studentEmails = await studentsRepo.findOneByEmail(emailAddress);
    return sponsorEmails.length === 0 && studentEmails.length === 0;
}

module.exports = {
    isEmailAddressAvailable,
    "post:/api/sponsors": onCreateProfile,
    "post:/api/students": onCreateProfile,
} 