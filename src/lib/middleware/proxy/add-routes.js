
/**
 * Addes a map of routes to the `proxy.routeMap` object
 * @param {Object} service - Object with routes and handlers attached to process 
 * data returned from a proxied service
 * 
*/

function addRoutes(service) {
    this.routeMap = Object.assign(this.routeMap, service);
}

module.exports = addRoutes;