# Devicon

[Download on Chrome Web Store](https://chrome.google.com/webstore/detail/devicon/giibkebjejbhlblmanjkmkmdkahmabge)

### Overlay your favicon in development environments

This is a Chrome extension for web developers. It looks at the URL of the page you're on to see if it's a dev environment and adds a border to the favicon so you can easily tell if you're on a dev environment or not.

You can change in the options what URL hostname constitutes a dev environment, by default we look for:

- `localhost`
- `127.0.0.1`
- Sites ending with `.dev` / `.test`

Note: If your site changes its favicon dynamically (such as with react-helmet), the overlay will be lost.

## Development

- `npm install` - Install node modules

- `npm run dev` - Watches for changes to scripts/styles under the `src` directory, and puts processed versions into the `build` directories under `ext`. Everything else (html/etc) can be changed manually in the `ext` directory.

- `npm run build` - Minifies assets and creates .zip file of the extension for the Chrome Web Store
