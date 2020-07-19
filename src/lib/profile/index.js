const { uuid } = require('uuidv4');

/**
    * Creates a new user profile entity.
    * @param {String} name - one of an enumerated set of types for an entity
    * @param {String} version - version number of the entity, maps to the JSON 
    * Schema version the entity validates against
    * @param {Object} data - payload of the entity
    * 
   */

function Profile({ name, version = '0.0.1', data }) {
    return {
        ...data,
        id: uuid(),
        entityName: name,
        entityVersion: version,
        entitySchema: `/api/schemas/${name}/v${version}.json`,
        createdAt: new Date().toISOString(),
        lastModifiedAt: null,
        status: null
    }
}