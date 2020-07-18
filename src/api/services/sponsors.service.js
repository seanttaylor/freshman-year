const ServerError = require('../../lib/error.lib');
const Entity = require('../../lib/entity');
const entityName = 'sponsor';

function create(data) {
    return Object.assign({
        isAccountActivated: false,
        status: 'awaiting-account-activation'
    }, new Entity({
        name: entityName,
        data
    }));
}

module.exports = {
    create,
};