const { shortUUID } = require('../utilities');
/* Implements the Chargeable interface */

/**
 * Creates a new Chargeable
 * @param {Number} amount - the amount of the charge
 * @param {String} currency - the ISO currency code of currency the charge is denominated in
 * @param {String} source - source (e.g. bank account, credit card) to create a charge against
 * @returns {Object}
 */

function of({ amount, currency = 'usd', source = shortUUID() }) {

    return {
        __amount: amount,
        __currency: currency,
        __source: source,
        createCharge
    }
}

/**
 * Executes a charge against a configured payment source
 * @returns {Object}
 */

async function createCharge() {
    return Promise.resolve({
        status: "ok",
        id: shortUUID(),
        createdAt: new Date().toISOString(),
        amount: this.__amount,
        currency: this.__currency,
        source: this.__source
    });
}

module.exports = {
    of
}