/* Implements the Transformable interface */
const fastJSONPatch = require("fast-json-patch");

const transactionPatchDoc = [
    { op: 'move', from: '/t_id', path: '/id' },
    { op: 'move', from: '/t_createdAt', path: '/createdAt' },
    { op: 'move', from: '/t_amount', path: '/amount' },
    { op: 'move', from: '/t_sponsor_id', path: '/sponsorId' }
];

const profilePatchDoc = [
    { op: 'move', from: '/s_id', path: '/id' },
    { op: 'move', from: '/s_createdAt', path: '/createdAt' },
    { op: 'move', from: '/s_firstName', path: '/firstName' },
    { op: 'move', from: '/s_lastName', path: '/lastName' },
    { op: 'move', from: '/s_emailAddress', path: '/emailAddress' },
    { op: 'move', from: '/s_profileImageURL', path: '/profileImageURL' }
];

const transformMap = {
    'transaction': function (data) {
        return fastJSONPatch.applyPatch(data, transactionPatchDoc).newDocument;
    },
    'profile': function (data) {
        return fastJSONPatch.applyPatch(data, profilePatchDoc).newDocument;
    }
}



/**
 * Creates a new Transformable
 * @param {Object} config - configuration object
 * @param {String} config.type - the destination shape
 * @param {Object} data - the source shape to be transformed
 * @returns 
 */

function of({ type }, data) {
    return transformMap[type](data);
}


module.exports = {
    of
}