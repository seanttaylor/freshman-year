const fetch = require('node-fetch');

/** Get all `sponsor` entities related to a `student entity` using the `/xjoin` API of 
 * the xmysql package. See docs: https://github.com/o1lab/xmysql#xjoin-query-params-and-values
 * @param {String} id - uuid of the student to update
 * @return {Object}
 */

const _fields = [
    'id',
    'firstName',
    'lastName',
    'emailAddress',
    'profileImageURL',
    'createdAt'
].map((fieldName) => `s.${fieldName}`).join(',');

async function getAllSponsorsByStudentId(id) {
    const queryString = `sp.student_sponsors,_j,s.sponsors&_on1=(s.id,eq,sp.sponsor_id)&_fields=${_fields}&_where=(sp.student_id,eq,${id})`;
    const uri = `${this.connectionURI}?_join=${queryString}`;
    const response = await fetch(uri);
    const data = await response.json();
    return data;
}

module.exports = {
    getAllSponsorsByStudentId
}