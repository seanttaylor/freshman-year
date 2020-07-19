const apiResponse = require('../../api-response')

/**
 * Provides default processing for responses from a proxied service if no processing handler 
 * is found on the `proxy.routeMap` object.
 * @param {String} proxyResData - Express response object returned from proxied service
 * @param {Object} userReq - Express request object from initial HTTP request
 * @param {Object}
 */

function resolveDefault({ proxyResData, userReq }) {
    if (Array.isArray(proxyResData)) {
        //The data service always returns an array for [GET] requests
        return apiResponse.onEntityCollection(...arguments);
    }
    /* The data service returns plain objects on [POST] and [PATCH] requests.
    * USUALLY [POST] proxy request handlers will be registered on the `
    * proxy.routeMap` object. So requests on this execution path will most  
    * likely be [PATCH] proxy requests that don't have a handler configured
    */
    return apiResponse.onUpdateEntityInstance(...arguments);
}

module.exports = resolveDefault;