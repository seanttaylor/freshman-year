const fetch = require("node-fetch");
const defaultHTTPHeaders = {
    'Content-Type': 'application/json'
};

async function connect({ host, defaultPath }) {
    this.__config.connectionURI = `${host}${defaultPath}`;
    this.__config.host = host;
    this.__config.fetch = fetch;
}

async function addOne(doc) {
    const response = await fetch(`${this.__config.connectionURI}`, {
        headers: defaultHTTPHeaders,
        method: 'POST',
        body: JSON.stringify(doc),
    });
    const data = await response.json();
    return data;
}

async function findAll(collectionName) {
    const response = await fetch(`${this.__config.connectionURI}`);
    const data = await response.json();
    return data;
}

async function findOne(_id) {
    const response = await fetch(`${this.__config.connectionURI}/${_id}`);
    const data = await response.json();
    return data;
}

async function findOneByEmail(emailAddress) {
    const response = await fetch(`${this.__config.connectionURI}/findOne?_where=(emailAddress,eq,${emailAddress})`);
    const data = await response.json();
    return data;
}

async function updateOne(_id, doc) {
    const response = await fetch(`${this.__config.connectionURI}/${_id}`, {
        headers: defaultHTTPHeaders,
        method: "PATCH",
        body: JSON.stringify(Object.assign(doc, { lastModifiedAt: new Date().toISOString() }))
    });
    const data = await response.json();
    return data;
}

async function removeOne(_id) {
    const response = await fetch(`${this.__config.connectionURI}/${_id}`, {
        method: "DELETE",
    });
    const data = await response.json();
    return data;
}

module.exports = {
    connect,
    addOne,
    removeOne,
    findAll,
    findOne,
    updateOne
};
