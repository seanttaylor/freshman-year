/**
* An object having the Cacheable API; a set of methods for managing cache entries.
* @typedef {Object} CacheableAPI
* @property {Function} set - introduce a new entry into the cache
* @property {Function} get - get an entry from the cache
* @property {Function} clear - clear all entries from the cache
* @property {Function} delete - delete a specified entry from the cache
* @property {Function} has - check for the existence of an entry in the cache
*/

/**
* The Cacheable interfaace
* @param {CacheableAPI} myImpl - Object containing methods implementing the Cacheable API
* @returns 
*/

function ICacheable(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    this.set = myImpl.set || required;

    this.get = myImpl.get || required;

    this.clear = myImpl.clear || required;

    this.delete = myImpl.delete || required;

    this.has = myImpl.has || required;

    return;
}


module.exports = ICacheable;