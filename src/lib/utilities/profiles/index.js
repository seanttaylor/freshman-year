const { studentAndSponsorContactQuery } = require('./config.json');

async function findOneByEmail(emailAddress) {
    const fetch = this.fetch;
    const uri = `${this.connectionURI}/findOne?_where=(emailAddress,eq,${emailAddress})`;
    const response = await fetch(uri);
    const data = await response.json();
    return data;
}

async function getStudentAndSponsorContactDetails({ student_id, sponsor_id }) {
    const fetch = this.fetch;
    const uri = `${this.host}/api/xjoin?_join=${studentAndSponsorContactQuery}`;
    const response = await fetch(uri);
    const data = await response.json();
    return data;
}

module.exports = {
    findOneByEmail,
    getStudentAndSponsorContactDetails
}