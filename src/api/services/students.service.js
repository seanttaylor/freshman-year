const ServerError = require('../../lib/error.lib');
const apiResponse = require('../../lib/api-response');

/**
 * The methods below apply formatting to records returned from the data service.
 * This logic is located here because the structure of the `express-http-proxy` package does
 * not allow for easy post-processing of responses from proxied API requests. The sole 
 * facility for achieving post-processing is through the user-configured `userResDecorator` 
 * method (see proxy-resolve.middleware)
 */


/**
* _ALL_ methods return a specified entity according to the JSON Schema specfication in 
* the /schemas folder.
* @param {Object} proxyRes - proxied service's Express response object
* @param {Object} proxyResData - proxied service's Express response data *only*
* @param {Object} userReq - original Express request object
* @param {Object} userRes - original Express response object
*/

function onGetStudents() {
    return apiResponse.onEntityCollection(...arguments);
}

function onGetStudentById() {
    return apiResponse.onEntityInstance(...arguments);
}

function onUpdateStudentById() {
    return apiResponse.onUpateEntityInstance(...arguments);
}

module.exports = {
    "get:/api/students": onGetStudents,
    "get:/api/students/:id": onGetStudentById,
    "patch:/api/students/:id": onUpdateStudentById
}