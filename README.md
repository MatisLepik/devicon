# Devicon

## Development

`gulp` - Watches for changes and serves the options page. `scripts/main.js` is for the content_script (`ext/src/main.js`), `optionScripts/main.js` is for the options page (`ext/src/options/main.js`).
`gulp build-production` - Creates minified versions of the assets for production.

To change the overlay, replace it in the root directory and type `npm run make-data-url` to update it in the js file.
This runs a Bash script, so ensure that your environment supports that.
