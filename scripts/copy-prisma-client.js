const fs = require('node:fs');
const path = require('node:path');

const source = path.join(__dirname, '..', 'src', 'generated');
const destination = path.join(__dirname, '..', 'dist', 'generated');

fs.cpSync(source, destination, { recursive: true });
