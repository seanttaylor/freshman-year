const URLMatcher = require('url-matcher');
const { matchPattern } = URLMatcher;

/**
 * Returns a route mapping to a  specific handler to complete processing of data 
 * returned from a proxied service.
 * @param {Object} userReq - Original Express request object
 * @returns {String} 
*/

function resolve(userReq) {
    const { method, url } = userReq;
    //TODO: Kill this hack; there is surely better path matching out there...
    /*Slices off the request method name prefixing keys on the 
    * `proxy.routeMap` object and finds the matching handler to complete processing the 
    * request. The matching logic is very liberal and matches the most general 
    * path in comparsion operations first. 
    */
    const route = Object.keys(this.routeMap).find((r) => {
        let _route = r.slice(r.indexOf(":") + 1);
        let result = matchPattern(_route, url);
        return result && !result.remainingPathname;
    });

    return `${method.toLowerCase()}:${route.slice(route.indexOf(':') + 1)}`;
}

module.exports = resolve;