/* Implements the Templatable interface */
const ejs = require('ejs');
const { promisify } = require('util');
const renderFile = promisify(ejs.renderFile);


/**
 * Creates a new Templatable
 * @param {String} templatePath - file path to a template
 * @param {Object} templateData - data used in the rendered template
 * @returns 
 */

function of(templatePath, templateData) {

    return {
        __templateData: templateData,
        __templatePath: templatePath,
        stamp
    }
}

/**
 * Renders a template into a string.
 * @param {String} templatePath - file path to a template
 * @param {Object} templateData - data used in the rendered template
 * @returns {String}
 */

async function stamp() {
    const template = await renderFile(this.__templatePath, this.__templateData);
    return template;
}

module.exports = {
    of
}