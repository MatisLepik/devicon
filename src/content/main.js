import { defaults } from '../shared/options';

setIconIfNeeded();

function loadOptions() {
  return new Promise(resolve => {
    chrome.storage.sync.get(defaults, resolve);
  });
}

function setIconIfNeeded() {
  loadOptions().then(opts => {
    if (isDevelopment(opts.hostnameRegex)) {
      chrome.runtime.sendMessage('showPageAction'); // Turn the extension icon colorful
      const link = document.querySelector('link[rel~="icon"]'); // rel~="icon" checks for the word "icon" (to get around apple-touch-icon, but still include rel="shortcut icon")
      const faviconUrl = link ? link.href : '/favicon.ico'; // If no links are found, we hope there is a favicon.ico in the root

      getImg(faviconUrl)
        .then(img => addOverlay(img, opts))
        .then(changeFavicon)
        .catch(err => console.error(err));
    }
  });
}

/**
 * Returns true if the site is detected to be on a development domain.
 * @return {Boolean}
 */
function isDevelopment(hostnameRegex) {
  if (hostnameRegex === '') return false; // This is so the user can easily set the field to empty if they want to disable the behaviour

  const hostname = window.location.hostname;
  return new RegExp(hostnameRegex).test(hostname);
}

/**
 * Changes the favicon in the DOM, by trying to find links with rel="icon".
 * If it doesn't find one, it creates one.
 * @param  {string}
 */
function changeFavicon(src) {
  const links = Array.from(document.querySelectorAll('link[rel~="icon"]'));
  if (links.length === 0) { // If there are no icon links, create one
    const link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
    links.push(link);
  }

  links.forEach(link => {
    link.href = src; // eslint-disable-line no-param-reassign
  });
}

/**
 * Async function. Returns a promise of an image object
 * @param  {string} src
 * @return {Promise<Image>}
 */
function getImg(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve();
    img.src = src;
  });
}

/**
 * Async function. Returns a promise of a blob for the combined image
 * @param  {Array<Image>} images
 * @return {Promise<string>}
 */
function addOverlay(img, opts) {
  console.log('addOverlay', img);
  return new Promise((resolve) => {
    // Create canvas and size it according to the original favicon
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img ? img.width : 16; // If there is no existing favicon, make it 16x16
    canvas.height = img ? img.height : 16;

    // Draw the favicon
    img && ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    // Dark overlay over the whole canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Border around canvas
    ctx.strokeStyle = opts.borderColor;
    ctx.lineWidth = Math.floor(canvas.width * opts.borderWidth / 16); // 2px border at 16x16. We need to scale this because the original canvas might be bigger and we dont wanna lose quality

    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      resolve(url);
    });
  });
}
