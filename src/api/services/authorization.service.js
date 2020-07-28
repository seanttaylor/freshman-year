const libPlaid = require('../../lib/plaid');


/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
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
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */

async function getAccessToken(options) {
    const { publicToken } = options;
    const data = await libPlaid.client.exchangePublicToken(publicToken);
    const { access_token, item_id } = data;
    console.log({ access_token, item_id });
    //await authRepo.addOne({sponsorId, acccess_token, item_id});
    return [];
};


module.exports = {
    createAuthToken,
    getAccessToken
}