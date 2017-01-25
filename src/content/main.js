// const OVERLAY_URL = require('./overlay-data');
import OVERLAY_URL from './overlay-data';
import { DEFAULT_REGEX_STRING } from '../shared/options';

setIconIfNeeded();

function setIconIfNeeded() {
  if (isDevelopment()) {
    chrome.runtime.sendMessage('showPageAction'); // Turn the extension icon colorful
    const link = document.querySelector('link[rel~="icon"]'); // rel~="icon" checks for the word "icon" (to get around apple-touch-icon, but still include rel="shortcut icon")
    const faviconUrl = link ? link.href : '/favicon.ico'; // If no links are found, we hope there is a favicon.ico in the root

    Promise.all([getImg(faviconUrl), getImg(OVERLAY_URL)])
      .then(combineImages)
      .then(changeFavicon)
      .catch(err => console.error(err));
  }
}

/**
 * Returns true if the site is detected to be on a development domain.
 * @return {Boolean}
 */
function isDevelopment() {
  const hostname = window.location.hostname;
  return new RegExp(DEFAULT_REGEX_STRING).test(hostname);
}

/**
 * Changes the favicon in the DOM, by trying to find links with rel="icon".
 * If it doesn't find one, it creates one.
 * @param  {string}
 */
function changeFavicon(src) {
  const links = document.querySelectorAll('link[rel~="icon"]');

  if (links.length === 0) { // Create a link if there are none
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = src;
    document.head.appendChild(link);
  } else { // Otherwise, replace the href on all links just in case (I don't know which one the browser might use)
    links.forEach(link => {
      link.href = src; // eslint-disable-line no-param-reassign
    })
  }
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
function combineImages(_images) {
  const images = _images.filter(img => img);
  if (images.length === 0) return Promise.reject('Not enough images');

  return new Promise((resolve) => {
    // const canvas = document.querySelector('#favicon');
    const canvas = document.createElement('canvas'); // TODO
    const ctx = canvas.getContext('2d');
    const firstImage = images[0];
    canvas.width = firstImage.width;
    canvas.height = firstImage.height;

    images.forEach(img => img && ctx.drawImage(img, 0, 0, firstImage.width, firstImage.height));

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      resolve(url);
    });
  });
}
