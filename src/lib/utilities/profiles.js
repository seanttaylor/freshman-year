async function findOneByEmail(emailAddress) {
    const fetch = this.__config.fetch;
    const uri = `${this.__config.connectionURI}/findOne?_where=(emailAddress,eq,${emailAddress})`;
    const response = await fetch(uri);
    const data = await response.json();
    return data;
}

module.exports = findOneByEmail;