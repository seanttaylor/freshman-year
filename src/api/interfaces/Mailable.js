/**
* An object having the Mailable API; a set of methods for sending emails.
* @typedef {Object} MailableAPI
* @property {Function} send - send an email to specified recipients
* @property {Function} addAttachments - add attachments to an email
* @property {Function} useTemplate - configure the email template to send the message 
*/

/**
* The Mailable interfaace
* @param {MailableAPI} myImpl - Object containing methods implementing the Mailable API
* @returns 
*/

function IMailable(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    this.__message = {};

    this.addAttachments = myImpl.addAttachments || required;

    this.send = myImpl.send || required;

    this.useTemplate = myImpl.useTemplate || required;

    return;
}

module.exports = IMailable;
