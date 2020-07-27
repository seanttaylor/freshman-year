const plaid = require('plaid');


/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */

async function createAuthToken(options) {
    const { id } = options;
    const client = new plaid.Client({
        clientID: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
        env: plaid.environments.sandbox
    });

    const plaidLinkToken = await client.createLinkToken({
        user: {
            client_user_id: id,
        },
        client_name: 'app.freshmanyr',
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


module.exports = {
    createAuthToken
}