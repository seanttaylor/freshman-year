const apiResponse = require('../../lib/api-response');
const Mailable = require('../interfaces/Mailable');
const Templatable = require('../interfaces/Templatable');
const libMailable = require('../../lib/mailable');
const libTemplatable = require('../../lib/templatable');
const myMailer = new Mailable(libMailable);
const template = new Templatable(libTemplatable);
//const newSponsorWelcomeEmail = '../../lib/mailable/templates/sponsor-welcome.ejs';
const sponsorWelcomeEmail = '/app/src/lib/mailable/templates/test.ejs';
//const ServiceResponse = require('../../lib/service-response'); 

/**
 * The methods below apply formatting to records returned from the data service.
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

async function onCreateSponsor({ proxyRes, proxyResData, userReq, userRes }) {
    const myEmailTemplate = await template.of(sponsorWelcomeEmail, {
        data: { ...userReq.body }
    }).stamp();
    myMailer.useTemplate(myEmailTemplate);

    myMailer.send({
        from: 'FreshmanYr Support <support@freshmanyr.io>',
        to: [userReq.body.emailAddress],
        subject: 'Welcome to FreshmanYR!'
    });
    //new ServiceResponse(...arguments).onCreateEntityInstance();
    return apiResponse.onCreateEntityInstance({ proxyRes, proxyResData, userReq, userRes });
}

module.exports = {
    "post:/api/sponsors": onCreateSponsor,
}