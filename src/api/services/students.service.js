const apiResponse = require('../../lib/api-response');

/**
 * The methods below apply formatting to records returned from the data service.
 * The `express-http-proxy` package does not allow for easy post-processing of responses from
 * proxied API requests. The sole facility for achieving post-processing is through 
 * the user-configured `userResDecorator` method (see middleware/proxy/proxy-resolve.)
 */


/**
* @param {Object} proxyRes - proxied service's Express response object
* @param {Object} proxyResData - proxied service's Express response data *only*
* @param {Object} userReq - original Express request object
* @param {Object} userRes - original Express response object
*/

function onCreateStudent() {
    return apiResponse.onCreateEntityInstance(...arguments);
}

module.exports = {
    "post:/api/students": onCreateStudent
}