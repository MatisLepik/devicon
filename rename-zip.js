/**
 * `npm run build` uses this to rename ext.zip to ext-version.zip. Ensure that ext.zip exists in the project root.
 */

const fs = require('fs');

fs.readFile('./ext/manifest.json', 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const version = JSON.parse(data).version;

  fs.rename('./ext.zip', `ext-${version.replace(/\./g, '-')}.zip`);
});
