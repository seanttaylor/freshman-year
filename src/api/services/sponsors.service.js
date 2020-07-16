const ServerError = require('../../lib/error.lib');
const { uuid } = require('uuidv4');

function Sponsor(data, entityVersion = '0.0.1') {
    const sponsorProfile = {
        ...data,
        id: uuid(),
        entityName: 'sponsor',
        entityVersion,
        entitySchema: `/api/schemas/v${entityVersion}.json`,
        createdAt: new Date().toISOString(),
        lastModifiedAt: null,
        isAccountActivated: false,
        status: 'awaiting-account-activation'
    };


    /**
     * Sets the status of a Sponsor entity
     * @param {String} status - one of an enumerated set of statuses for a sponsor
     * 
    */

    function setStatus(status) {
        sponsorProfile.status = status;
    }

    /**
     * Set the activation status of a Sponsor entity
     * @param {Boolean} flag - indicatind whether the account has been activated 
    */

    function setIsAccountActivated(flag) {
        sponsorProfile.isAccountActivated = flag;
    }

    /**
     * Set the activation status of a Sponsor entity
     * @param {Boolean} flag - indicatind whether the account has been activated 
    */

    /**
     * Returns the profile object of the Sponsor entity
     * @returns {Object}
    */
    function toJSON() {
        return sponsorProfile;
    }


    return {
        setStatus,
        setIsAccountActivated,
        toJSON
    }

}

module.exports = Sponsor;