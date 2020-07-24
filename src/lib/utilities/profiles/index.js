const fetch = require('node-fetch');

async function findOneByEmail(emailAddress) {
    const uri = `${this.connectionURI}/findOne?_where=(emailAddress,eq,${emailAddress})`;
    const response = await fetch(uri);
    const data = await response.json();
    return data;
}

module.exports = {
    findOneByEmail
}