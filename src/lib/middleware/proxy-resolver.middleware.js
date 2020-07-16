//See docs at: https://www.npmjs.com/package/express-http-proxy
const proxy = require('express-http-proxy');
const DEFAULT_PROXY_BASE_PATH = '/api';

/**
 * Creates an Express-compatible middleware for use as a reverse proxy.
 * @param {String} proxyURL - The URL to forward requests to.
 * @returns {Function} - function with Express middleware signature.
 * 
*/

function myReverseProxy(proxyURL) {
    return proxy(proxyURL);
}

module.exports = myReverseProxy;
