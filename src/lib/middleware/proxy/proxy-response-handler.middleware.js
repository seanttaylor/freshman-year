/**
 * The methods below apply formatting to records returned from the data service.
 * This logic is located here because the structure of the `express-http-proxy` package does
 * not allow for easy post-processing of responses from proxied API requests. The sole 
 * facility for achieving post-processing is through the user-configured `userResDecorator` 
 * method (see proxy-resolve.middleware)
 */


/**
* _ALL_ methods return a specified entity according to the JSON Schema specfication in 
* the /schemas folder.
* @param {Object} proxyRes - proxied service's Express response object
* @param {Object} proxyResData - proxied service's Express response data *only*
* @param {Object} userReq - original Express request object
* @param {Object} userRes - original Express response object
*/

function onEntityCollection(proxyRes, proxyResData, userReq, userRes) {
    return {
        entries: proxyResData.length,
        data: proxyResData
    }
}

function onEntityInstance(proxyRes, proxyResData, userReq, userRes) {
    return {
        entries: 1,
        data: [
            ...proxyResData
        ]
    }
}

function onCreateEntityInstance(proxyRes, proxyResData, userReq, userRes) {
    return {
        entries: 1,
        data: [{
            ...userReq.body
        }]
    }
}

function onUpateEntityInstance(proxyRes, proxyResData, userReq, userRes) {
    return {
        entries: 1,
        data: [{
            id: userReq.url.slice(userReq.url.lastIndexOf('/') + 1),
            href: userReq.url
        }]
    }
}



module.exports = {
    //Sponsors
    "get:/api/sponsors": onEntityCollection,
    "get:/api/sponsors/:id": onEntityInstance,
    "patch:/api/sponsors/:id": onUpateEntityInstance,
    "post:/api/sponsors": onCreateEntityInstance,
    //Accounts
    "get:/api/accounts": onEntityCollection,
    "get:/api/accounts/:id": onEntityInstance,
    //Students
    "get:/api/students": onEntityCollection,
    "get:/api/students/:id": onEntityInstance,
    "patch:/api/students/:id": onUpateEntityInstance,
    //Transactions
    "get:/api/transactions": onEntityCollection,
    "get:/api/transactions/:id": onEntityInstance
}