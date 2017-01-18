# Devicon

## Development

`gulp` - Watches for changes and serves the options page for development. `src/scripts/content.js` is for the content_script, `src/optionScripts/options.js` is for the options page. scss gets combined options page folder. Do not modify the css/js files in /ext manually.
`gulp build-production` - Creates minified versions of the assets for production.

To change the overlay, replace it in the root directory and type `npm run make-data-url` to update it in the js file.
This runs a Bash script, so ensure that your environment supports that.
