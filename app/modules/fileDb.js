const fs = require('fs').promises;
const path = require('path');

async function readJsonFrom(...parts) {
  const fullPath = path.join(__dirname, '..', 'json', ...parts);
  try {
    const content = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    throw err;
  }
}

module.exports = { readJsonFrom };
