//See docs at: https://www.npmjs.com/package/express-http-proxy
const proxy = require('express-http-proxy');

/**
 * Creates an Express-compatible middleware for use as a reverse proxy.
 * @param {String} proxyURL - The URL to forward requests to.
 * @param {Object} proxyRouter - module that contains methods that 
 * formats response from the proxied  service before sending a final response to the 
 * requesting client
 * @returns {Function} - function with Express middleware signature.
 * 
*/

function myReverseProxy(proxyURL, proxyRouter) {
    const myProxyConfiguration = proxy(proxyURL, {
        proxyErrorHandler: function (err, res, next) {
            next(err);
            return;
        },
        userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
            const data = JSON.parse(proxyResData.toString('utf8'));
            try {
                const route = proxyRouter.resolve(userReq);
                return proxyRouter.routeMap[route]({
                    proxyRes,
                    proxyResData: data,
                    userReq,
                    userRes
                })
            } catch (e) {
                //console.info("Using default resolve method.");
                return proxyRouter.resolveDefault({
                    proxyRes,
                    proxyResData: data,
                    userReq,
                    userRes
                });
            }
        }
    });

    return myProxyConfiguration;
}

module.exports = myReverseProxy;
