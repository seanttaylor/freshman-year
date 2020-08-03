/**
 * API for transforming POJO to structure hypermedia respose formats.  
 * @typedef {Object} HypermediaAPI
 * @property {Function} createResourceDigest - creates a hypermedia resource with a subset of
 * all data fields  
 */

/**
* The HypermediaService interfaace
* @param {HypermediaAPI} myImpl - Object containing methods implementing the Hypermedia API
* @returns 
*/

function IHypermediaService(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    this.createResourceDigest = myImpl.createResourceDigest || required;


    return;
}

module.exports = IHypermediaService;
