const Migrateable = require('../../../api/interfaces/Migrateable');
const libMigrate = require('./tool');
const environment = process.env.NODE_ENV || 'local';

console.info('#####################################################');
console.info(`Checking for migrations on [${environment}] environment `);
console.info('#####################################################');
const MigrationTool = new Migrateable(libMigrate).of({
    environment,
    configFilePath: './database.json',
    targetDirectory: './migrations'
});

module.exports = MigrationTool;
