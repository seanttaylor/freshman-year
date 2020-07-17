/**
 * The methods below applying formatting to records returned from the data service.
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

module.exports = {
    //Sponsors
    "get:/api/sponsors": function (proxyRes, proxyResData, userReq, userRes) {
        return {
            entries: proxyResData.length,
            data: proxyResData
        }
    },
    "post:/api/sponsors": function (proxyRes, proxyResData, userReq, userRes) {
        return {
            entries: 1,
            data: [{
                ...userReq.body
            }]
        }
    },
    //Accounts
    "get:/api/accounts": function (proxyRes, proxyResData, userReq, userRes) {
        return {
            entries: proxyResData.length,
            data: proxyResData
        }
    },
    //Students
    "get:/api/students": function (proxyRes, proxyResData, userReq, userRes) {
        return {
            entries: proxyResData.length,
            data: proxyResData
        }
    },
    "get:/api/students/:id": function (proxyRes, proxyResData, userReq, userRes) {
        return {
            entries: 1,
            data: [
                ...proxyResData
            ]
        }
    },
    //Transactions
    "get:/api/transactions": function (proxyRes, proxyResData, userReq, userRes) {
        return {
            entries: proxyResData.length,
            data: proxyResData
        }
    }

}