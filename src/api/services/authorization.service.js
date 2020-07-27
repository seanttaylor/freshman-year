const plaid = require('plaid');
const client = new plaid.Client({
    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: plaid.environments.sandbox
});


/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */

async function createAuthToken(options) {
    const { id } = options;
    const plaidLinkToken = await client.createLinkToken({
        user: {
            client_user_id: id,
        },
        client_name: 'FreshmanYR',
        products: ['auth', 'transactions'],
        country_codes: ['US'],
        language: 'en',
        // webhook: 'https://sample.webhook.com',
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
    const data = await client.exchangePublicToken(publicToken);
    const { access_token, item_id } = data;
    console.log({ access_token, item_id });

    return [];
};


module.exports = {
    createAuthToken,
    getAccessToken
}