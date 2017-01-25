# Devicon

## Development

`npm run dev` - Watches for changes and serves the options page for development. Styles/scripts should be changed in the `src` directory, they will be processed and sent to the `ext` directory automatically. Everything else (html/etc) can be manually put in the `ext` directory.
`npm run build` - Creates minified versions of the assets for production.

## Generating overlay

The favicon overlay is stored in an encoded form in the `src/content/overlay-data.js` file to get around file permission issues.
To change the overlay, replace the image in the root directory and type `npm run make-data-url` to update the js file.
This runs a Bash script, so ensure that your environment supports that.
