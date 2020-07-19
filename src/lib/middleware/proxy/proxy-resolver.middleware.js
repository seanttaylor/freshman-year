//See docs at: https://www.npmjs.com/package/express-http-proxy
const proxy = require('express-http-proxy');
const URLMatcher = require('url-matcher');
const { matchPattern } = URLMatcher;
//const proxyResponseHandler = require('./proxy-response-handler.middleware');
const DEFAULT_PROXY_BASE_PATH = '/api';

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

            /*return proxyServices.get()[`${method.toLowerCase()}:${handler.slice(handler.indexOf(':') + 1)}`](
                proxyRes,
                JSON.parse(proxyResData.toString('utf8')),
                userReq,
                userRes
            )*/

            //TODO: Kill this hack; there assuredly better path matching out there...
            /*This block slices off the request method name prefixing keys on the 
            * `proxyResponseHandler` map and finds the matching handler to process the 
            * request. The matching logic is very liberal and matches the most general 
            * path in comparsion operations first. 
            */
            /*const handler = Object.keys(proxyResponseHandler).find((route) => {
                let _route = route.slice(route.indexOf(":") + 1);
                let result = matchPattern(_route, url);
                return result && !result.remainingPathname;
            });*/

            /*Have to slice the request method name off the handler string again here in 
            * order to pair the right path with the right method on the proxyResponseHandler
            */
            /*const data = proxyResponseHandler[`${method.toLowerCase()}:${handler.slice(handler.indexOf(':') + 1)}`](
                proxyRes,
                JSON.parse(proxyResData.toString('utf8')),
                userReq,
                userRes
            );
            return JSON.stringify(data);*/
        }
    });

    return myProxyConfiguration;
}

module.exports = myReverseProxy;
