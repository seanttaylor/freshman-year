const libPlaid = require('../../lib/plaid');
const { findOneBy } = require('../../lib/mixins');
const Repository = require('../interfaces/Repository');
const libRepository = require('../../lib/repository');
const startDate = '2020-05-01';
const endDate = '2020-07-01';
const repo = Object.assign(new Repository(libRepository), { findOneBy });
repo.connect({
    host: 'http://data_service:3000',
    defaultPath: '/api/sponsor_plaid_credentials'
})

/** Fetches the latest transactions for a specified 
 * @param {String} itemId - itemId associated with the transaction from Plaid
 * @return
 */

async function getUpdatedTransactions(itemId) {
    const [record] = await repo.findOneBy('item_id', itemId);
    const plaidAccessToken = record.access_token;
    const { transactions } = await libPlaid.client.getTransactions(plaidAccessToken, startDate, endDate);

    return transactions;
}

/** Returns the amount of the roundups for a list of transactions.
 * @param {String} txList - A list of Plaid `transaction` objects
 * @return
 */

async function getTransactionRoundups(txList) {
    const roundUps = txList.map(({ amount }) => amount.toString())
        .filter((value) => !value.includes('-') && value.includes('.'))
        .map((value) => 100 - (value.slice(value.lastIndexOf('.') + 1)));

    return roundUps;
}

module.exports = {
    getUpdatedTransactions,
    getTransactionRoundups
}