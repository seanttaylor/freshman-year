/**
* An object having the Templatable API; a set of methods for creating arbitrary 
* templated objects.
* @typedef {Object} TemplatableAPI
* @property {Function} of - create a new templated object
*/

/**
* The Templatable interfaace
* @param {TemplatableAPI} myImpl - Object containing methods implementing the Templatable API
* @returns
*/

function ITemplatable(myImpl) {
  function required() {
    throw Error("Missing implementation");
  }

  /**
    * Creates a new Templatable instance exposing the Templatable API
    * @param {String} templatePath - the path to a template
    * @param {Object} data - a POJO containing data for use by the Templatable
    * @returns {Object} - an object having a `stamp` method for creating rendered templates 
    */
  this.of = myImpl.of || required;

  return;
}

module.exports = ITemplatable;
