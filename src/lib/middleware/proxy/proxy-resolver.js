//See docs at: https://www.npmjs.com/package/express-http-proxy
const proxy = require('express-http-proxy');

/**
 * Creates an Express-compatible middleware for use as a reverse proxy.
 * @param {String} proxyURL - The URL to forward requests to.
 * formats response from the proxied  service before sending a final response to the 
 * requesting client
 * @returns {Function} - function with Express middleware signature
 * 
*/

function myReverseProxy(proxyURL) {

    const myProxyConfiguration = proxy(proxyURL, {
        proxyErrorHandler,
        userResDecorator: userResDecorator.bind(this)
    });

    return myProxyConfiguration;
}

/**
 * Handles errors returned from the proxied service
 * @param {Object} err - The Express Error object
 * @param {Object} res - The Express response object
 * 
*/

function proxyErrorHandler(err, res, next) {
    next(err);
    return;
}

/**
* Decorates a response returned from a proxied service
* @param {Object} proxyRes - proxied service's Express response object
* @param {Object} proxyResData - proxied service's Express response data *only*
* @param {Object} userReq - original Express request object
* @param {Object} userRes - original Express response object
*/

function userResDecorator(proxyRes, proxyResData, userReq, userRes) {
    const data = JSON.parse(proxyResData.toString('utf8'));
    const route = this.resolve(userReq);

    if (this.routeMap[route]) {
        return this.routeMap[route]({
            proxyRes,
            proxyResData: data,
            userReq,
            userRes
        });
    }

    console.info(`Using default resolve method for route: ${userReq.url}`);
    return this.resolveDefault({
        proxyRes,
        proxyResData: data,
        userReq,
        userRes
    });
}

module.exports = myReverseProxy;
