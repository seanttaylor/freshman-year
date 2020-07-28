const fetch = require('node-fetch');

/** Get all `sponsor` entities related to a `student` entity using the `/xjoin` API of 
 * the xmysql package. See docs: https://github.com/o1lab/xmysql#xjoin-query-params-and-values
 * @param {String} id - uuid of the student
 * @return {Object}
 */

const defaultFields = [
    'id',
    'firstName',
    'lastName',
    'emailAddress',
    'profileImageURL',
    'createdAt'
].map((fieldName) => `s.${fieldName}`).join(',');

async function getAllSponsorsByStudentId(id) {
    const queryString = `sp.student_sponsors,_j,s.sponsors&_on1=(s.id,eq,sp.sponsor_id)&_fields=${defaultFields}&_where=(sp.student_id,eq,${id})`;
    const uri = `${this.connectionURI}?_join=${queryString}`;
    const response = await fetch(uri);
    const data = await response.json();
    return data;
}

/** 
 * Get all `student` entities related to a `sponsor` entity using the `/xjoin` API of 
 * the xmysql package. See docs: https://github.com/o1lab/xmysql#xjoin-query-params-and-values
 * @param {String} id - uuid of the sponsor
 * @return {Object}
 */

async function getAllStudentsBySponsorId(id) {
    const queryString = `sp.student_sponsors,_j,s.students&_on1=(s.id,eq,sp.student_id)&_fields=${defaultFields}&_where=(sp.sponsor_id,eq,${id})`;
    const uri = `${this.connectionURI}?_join=${queryString}`;
    const response = await fetch(uri);
    const data = await response.json();
    return data;
}

/** 
 * Find a record by the value of a single specified field on that record
 * @param {String} fieldName - Field name to search on
 * @param {String} fielValue - Value of the field to match against
 * @return {Object}
 */
async function findOneBy(fieldName, fieldValue) {
    const response = await fetch(`${this.connectionURI}/findOne?_where=(${fieldName},eq,${fieldValue})`);
    const data = await response.json();
    return data;
}

module.exports = {
    getAllSponsorsByStudentId,
    getAllStudentsBySponsorId,
    findOneBy
}