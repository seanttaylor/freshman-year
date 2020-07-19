
module.exports = {
    configuration: require('./proxy-resolver.middleware'),
    addRoutes: require('./add-routes'),
    resolve: require('./resolve'),
    resolveDefault: require('./resolve-default'),
    routeMap: {}
}