// function main() {
//   if (isDevelopment()) {
//     const link = document.querySelector('link[rel*="icon"]');
//     const faviconUrl = link ? link.href : '/favicon.ico';
//
//     Promise.all([getImg(faviconUrl), getImg('/overlay.png')])
//       .then(combineImages)
//       .then(changeFavicon);
//   }
// }
//
// /**
//  * Returns true if the site is detected to be on a development domain.
//  * @return {Boolean}
//  */
// function isDevelopment() {
//   const hostname = window.location.hostname;
//   return hostname === 'localhost'
//     || hostname === '127.0.0.1'
//     || hostname.substr(hostname.length - 4) === '.dev';
// }
//
// /**
//  * Changes the favicon in the DOM, by trying to find a link with rel="icon".
//  * If it doesn't find one, it creates one.
//  * @param  {string}
//  */
// function changeFavicon(src) {
//   let link = document.querySelector('link[rel*="icon"]');
//
//   if (!link) {
//     link = document.createElement('link');
//     link.rel = 'icon';
//     document.head.appendChild(link);
//   }
//
//   link.href = src;
// }
//
/**
 * Async function. Returns a promise of an image object
 * @param  {string} src
 * @return {Promise<Image>}
 */
function getImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(img);
    img.src = src;
  });
}
//
// /**
//  * Async function. Returns a promise of a blob for the combined image
//  * @param  {Array<Image>} images
//  * @return {Promise<string>}
//  */
// function combineImages(images) {
//   if (images.length < 2) return Promise.reject('Not enough images');
//
//   return new Promise((resolve) => {
//     const canvas = document.querySelector('#favicon');
//     // const canvas = document.createElement('canvas'); // TODO
//     const ctx = canvas.getContext('2d');
//     const firstImage = images[0];
//     canvas.width = firstImage.width;
//     canvas.height = firstImage.height;
//
//     images.forEach(img => ctx.drawImage(img, 0, 0, firstImage.width, firstImage.height));
//
//     canvas.toBlob(function(blob) {
//       const url = URL.createObjectURL(blob);
//       resolve(url);
//     });
//   });
// }
//
// main();

getImg('overlay.png').then(img => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  document.body.appendChild(canvas);
  console.log('canvas.toDataURL()', canvas.toDataURL());
  canvas.toBlob(blob => {
    // const url = URL.createObjectURL(blob);
    console.log(url);
  });
})
