const libCacheable = require('../cacheable');
const Cacheable = require('../../api/interfaces/Cacheable');
const myCache = new Cacheable(libCacheable);

module.exports = function (req, res, next) {
    req.app.cache = myCache;
    next();
}