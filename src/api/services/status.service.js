const ServerError = require('../../lib/error.lib');

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */

module.exports.getAppStatus = async (options) => {
    return {
        status: 200,
        data: {
            STATUS: "OK"
        }
    };
};