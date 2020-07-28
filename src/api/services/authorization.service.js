const libPlaid = require('../../lib/plaid');
const Repository = require('../interfaces/Repository');
const libRepository = require('../../lib/repository');
const repo = new Repository(libRepository);
repo.connect({
    host: 'http://data_service:3000',
    defaultPath: '/api/sponsor_plaid_credentials'
});


/**
 * Creates a Plaid Link token
 * @param {Object} options
 * @throws {Error}
 * @return {Object}
 */

async function createAuthToken(options) {
    const { id } = options;
    const plaidLinkToken = await libPlaid.client.createLinkToken({
        user: {
            client_user_id: id,
        },
        client_name: 'FreshmanYR',
        products: ['auth', 'transactions'],
        country_codes: ['US'],
        language: 'en',
        webhook: 'http://localhost:3001/webhooks/plaid',
    });

    return [{
        tokenType: options.type,
        token: plaidLinkToken
    }]
};

/**
 * Exchanges a Plaid-issued public token for an access token used for Plaid API services
 * @param {Object} options
 * @throws {Error}
 * @return {Object}
 */

async function getAccessToken(options) {
    const { publicToken } = options;
    const data = await libPlaid.client.exchangePublicToken(publicToken);
    const { access_token, item_id } = data;
    await repo.addOne({ sponsor_id, acccess_token, item_id });
    return [];
};


module.exports = {
    createAuthToken,
    getAccessToken
}