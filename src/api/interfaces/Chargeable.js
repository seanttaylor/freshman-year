/**
 * Chargeables are anything that can represent a charge or a set of charges 
 * (e.g. a charge to a credit card or bank account.) A charge can also represent 
 * an amount to be paid or refunded.  
 * @typedef {Object} Chargeable
 * @property {Function} of - creates a new object with the ChargeableAPI 
 */

/**
* An object having the Chargeable API; a set of methods for computing and settling
* charges.
* @typedef {Object} ChargeableAPI
* @property {Function} createCharge - Creates a charge on a configured payment method
*/

function IChargeable(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    /**
       * Creates a new Chargeble instance exposing the Chargeable API
       * @param {Object} - a POJO containing data for use by the Chargeable
       * @returns {ChargeableAPI} 
       */
    this.of = myImpl.of || required;


    return;
}

module.exports = IChargeable;
