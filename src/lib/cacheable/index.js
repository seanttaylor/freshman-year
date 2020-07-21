/* Implements the Cacheable interface */
const memoryCache = require('memory-cache');

/**
* An object having the Mailable API; a set of methods for sending emails.
* @typedef {Object} CacheEntry
* @property {String} key - the key of a specified cache entry
* @property {String} value - the value of a cache entry
* @property {Number} ttl - the Time-to-Live of the cache entry 
*/

/**
* Creates a new cache entry
* @param {CacheEntry} entry - A new entry to introduce into the cache
*/

function set({ key, value, ttl }) {
    memoryCache.put(key, value, ttl);
}

/**
* Gets an existing cache entry
* @param {String} key - the key of a specified cache entry
* @returns {CacheEntry}
*/

function get(key) {
    memoryCache.get(key);
}

/**
* Deletes an entry from the cache
* @param {String} key - the key of a specified cache entry
*/

function _delete(key) {
    memoryCache.delete(key);
}

/**
* Clears the cache of all entries
*/

function clear() {
    memoryCache.clear();
}

/**
* Checks whether a given cache entry is expired
* @param {String} key - the key of a specified cache entry
* @returns {Boolean} 
*/

function isExpired(key) {
    return !memoryCache.keys().includes(key);
}

module.exports = {
    set,
    get,
    delete: _delete,
    clear,
    isExpired
}