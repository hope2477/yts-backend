const fs = require('fs');
const path = require('path');

const loadEmailTemplate = (templateName, variables) => {
    const templatePath = path.join(__dirname, '../templates', templateName);
    let template = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders in the template
    for (const key in variables) {
        const placeholder = new RegExp(`\\$\\{${key}\\}`, 'g'); // Match ${key}
        template = template.replace(placeholder, variables[key] || '');
    }

    return template;
};

module.exports = { loadEmailTemplate };