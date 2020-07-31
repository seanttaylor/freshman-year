/**
 * Transformables are POJOs that can be transformed to a different, specified shape.  
 * @typedef {Object} Transformable
 * @property {Function} of - creates a new object with the ChargeableAPI 
 */

/**
* An object having the Transformable API; a set of methods for transforming a source object 
* to the shape of a specified destination
* @typedef {Object} TransformableAPI
* No methods currently specified for this API 
*/

function ITransformable(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    /**
       * Creates a new Chargeble instance exposing the Chargeable API
       * @param {Object} - a POJO containing data for use by the Chargeable
       * @returns {TransformableAPI} 
       */
    this.of = myImpl.of || required;


    return;
}

module.exports = ITransformable;
