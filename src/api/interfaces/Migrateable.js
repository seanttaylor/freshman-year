/**
 *  An object having the Migrateable API, a set of methods for executing database migrations
 * @typedef {MigrateableAPI}
 * @property {Function} up - Perform `up` migrations on a datasource
 * @property {Function} down - Perform `down` migrations on datasource
 * @property {Function} create - Creates a new migration
 */

/**
 * The Migrateable interface
 * @param {Object} myImpl - Object containing methods implementing the Migrateable API
 * @returns {MigrateableAPI} 
 */
function IMigrateable(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    this.of = myImpl.of || required;

}

module.exports = IMigrateable;