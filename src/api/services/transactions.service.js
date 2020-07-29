//const libStripe = require('../../lib/stripe');
const libPlaid = require('../../lib/plaid');
const libChargeable = require('../../lib/chargeable');
const Chargeable = require('../interfaces/Chargeable');
const chargeable = new Chargeable(libChargeable);
const eventEmitter = require('../../lib/events');
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

eventEmitter.on('webhooks.transactionsUpdateAvailable', onTransactionsUpdateAvailable);

/** Handles the `webhooks.transactionsUpdateAvailable` event
 * @param {String} itemId - itemId associated with the transaction from Plaid
 * @return
 */

async function onTransactionsUpdateAvailable(itemId) {
    const transactions = await getUpdatedTransactions(itemId);
    const roundUps = await getTransactionRoundups(transactions);
    //**ENABLING STRIPE INTEGRATION IN PLAID API REQUIRED TO COMPLETE PAYMENT FLOW**
    //const [record] = await repo.findOneBy('item_id', itemId);
    //const result = await libPlaid.client.getAccounts(record.access_token);
    //const myAccountId = result.accounts[0]['account_id'];
    //const myStripeToken = await libPlaid.client.createStripeToken(record.access_token, myAccountId);
    //Create Stripe charges for each amount in the list, example of one charge below
    /*await libStripe.client.charges.create({
        amount: Number(`.${roundUps[0]}`),
        currency: 'usd',
        source: myStripeToken
    });*/

    const chargeList = roundUps.map((amt) => {
        return chargeable.of({ amount: Number(`.${amt}`) }).createCharge()
    });
    const res = await Promise.all(chargeList);


    //Promise.all(charges);

}

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