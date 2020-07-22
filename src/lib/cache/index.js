const libCacheable = require('./cacheable');
const Cacheable = require('../../api/interfaces/Cacheable');
const applicationCache = new Cacheable(libCacheable);

module.exports = applicationCache;