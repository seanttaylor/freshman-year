/**
* An object having the Cacheable API; a set of methods for managing cache entries.
* @typedef {Object} CacheableAPI
* @property {Function} send - send an email to specified recipients
* @property {Function} addAttachments - add attachments to an email
* @property {Function} useTemplate - configure the email template to send the message 
*/

/**
* The Cacheable interfaace
* @param {CacheableAPI} myImpl - Object containing methods implementing the Cacheable API
* @returns 
*/

function ICacheable(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    this.set = myImpl.set || required;

    this.get = myImpl.get || required;

    this.clear = myImpl.clear || required;

    this.delete = myImpl.delete || required;

    this.has = myImpl.has || required;

    return;
}


module.exports = ICacheable;