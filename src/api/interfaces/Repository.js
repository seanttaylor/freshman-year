/**
* An object having the Repository API; a set of methods for CRUD on a datasource.
* @typedef {Object} RepositoryAPI
* @property {Function} connect - Initialize a connection to a datasource
* @property {Function} addOne - Add a new entity
* @property {Function} removeOne - Remove a specified entity
* @property {Function} updateOne - Updated properties on a specified entity
* @property {Function} findAll - Find all entities
* @property {Function} findOne - Find an entity by unique id
* @property {Function} close - Close a connection to a datasource
*/

/**
* The Repository interfaace
* @param {RepositoryAPI} myImpl - Object containing methods implementing the Repository API
* @returns 
*/

function IRepository(myImpl) {
   function required() {
      throw Error("Missing implementation");
   }

   this.__config = {};

   /**
      * Connect to the datasource.
      * @param {String} data - document to add to the datasource.
      * @param {String} collectionName - Name of collection to add to.
      * @param {String} customId - An optional custom id to use for document lookup. 
      * @returns {Object}
      */
   this.connect = myImpl.connect || required;

   /**
      * A a document to the datasource.
      * @param {String} data - document to add to the datasource.
      * @param {String} collectionName - Name of collection to add to.
      * @returns {Object}
      */
   this.addOne = myImpl.addOne || required;

   /**
      * Remove a document from a collection BY ID ONLY.
      * @param {String} _id - Id of the document in the datasource.
      * @param {String} collectionName - Collection to from from. 
      * @returns {Object}
      */
   this.removeOne = myImpl.removeOne || required;

   /**
      * Update a document in the datasource BY ID ONLY.
      * @param {String} _id - Id of the document in the datasource.
      * @param {String} doc - Update document.
      * @param {String} collectionName - Collection to update. 
      * @returns {Object}
      */
   this.updateOne = myImpl.updateOne || required;

   /**
      * Find all documents in a collection.
      * @param {String} collectionName - Collection to pull from. 
      * @returns {Object}
      */
   this.findAll = myImpl.findAll || required;

   /**
      * Find a document in a collection BY ID ONLY.
      * @param {String} _id - Id of the document. 
      * @param {String} collectionName - Collection to pull from. 
      * @returns {Object}
      */
   this.findOne = myImpl.findOne || required;

   /**
      * @throws {Error}
      * @return {Promise}
      */
   this.updateOne = myImpl.updateOne || required;

   /**
      * Creates a UUID for a document.
      * @param {String} customId - [optional] custom id for the document.
      * @returns {String}
      */
   this.createUUID = myImpl.createUUID || required;

   /**
      * Closes an existing connection to the datasource.
      * @returns
      */
   this.close = myImpl.close || required;

   return;
}

module.exports = IRepository;
