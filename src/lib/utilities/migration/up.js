const MigrationTool = require('./index');

/**
 * Runs an `up `migration on a MySQL database
 * @param {Object} migrationTool - an object having the MigrateableAPI
 */

(function up(migrationTool) {
    migrationTool.up();

    console.info('#####################################################');
    console.info(`# Migration completed at ${new Date().toISOString()} #`);
    console.info('#####################################################');
}(MigrationTool));