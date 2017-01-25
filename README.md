# Devicon

## Development

- `npm run dev` - Watches for changes to scripts/styles under the `src` directory, and puts processed versions into the `build` directories under `ext`. Everything else (html/etc) can be changed manually in the `ext` directory.

- `npm run build` - Creates minified versions of the assets for production.

## Generating overlay

The favicon overlay is stored in an encoded form in the `src/content/overlay-data.js` file to get around file permission issues.
To change the overlay, replace the image in the root directory and type `npm run make-data-url` to update the js file.
This runs a Bash script, so ensure that your environment supports that.
