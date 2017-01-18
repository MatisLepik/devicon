/* eslint-disable max-len */
const OVERLAY_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAE0klEQVR4Xu2dzUtUYRyF74zaGMqoI0441ahpihDqZkQJQVeGy2jTokWYFW4SSagQ2ohIfkCbWoS7ViEuIoRWJYFWLlQqJfEbm1BzdCQ/Bscx9A/oVX/ctzzvcf2ee+9zzgPeGRAdoarAL4s/xjbgoADGbn8ATgHM3p8CGL4/BaAAfAk02gG+Axg9P18CDZ+fAlAAfg9gtgN8BzB7f34MNHx/CkAB+D2A0Q7wHcDo+fkx0PD5KQAF4PcAZjvAdwCz9+fHQMP3pwAUgN8DGO0A3wGMnp8fAw2fnwJQgH/xPUA4Gp0e3djs7w+Fx14vr/6c2ohsm7jEeZfrVMCd5L6SkXqxNCW5/GyiqzzOshw6u9D6DrAdi4VeLa08bxifHdYJeVLu1ZTjy2vwZzaedjq9up5ZmwBbsdjinbGZx2+WQ/xTtL+sW+P1pHcX5rS5nM40HRJoEWDXsvaezP542D4TnNQBddLv0VmQXXLTl9Gsg0OLAAuR7Y9FA186dACh3GO6oqQ1NT4h324eLQL0LK503h6bHrQbBun6vcX51ZWelDq7mbQIcOvr1N1e/u4/0pb1fq+/JTer60ihYxzWIsClgeHrwUh05xjPZ2wkN8mVOFRa9NLuArQI4Hk3dM1uEMTrh6oCPXZzUQC7GxZcnwIIykOIUgCEFQUMFEBQHkKUAiCsKGCgAILyEKIUAGFFAQMFEJSHEKUACCsKGCiAoDyEKAVAWFHAQAEE5SFEKQDCigIGCiAoDyFKARBWFDBQAEF5CFEKgLCigIECCMpDiFIAhBUFDBRAUB5ClAIgrChgoACC8hCiFABhRQEDBRCUhxClAAgrChgogKA8hCgFQFhRwEABBOUhRCkAwooCBgogKA8hSgEQVhQwUABBeQhRCoCwooCBAgjKQ4hSAIQVBQwUQFAeQpQCIKwoYKAAgvIQohQAYUUBAwUQlIcQpQAIKwoYKICgPIQoBUBYUcBAAQTlIUQpAMKKAgYKICgPIUoBEFYUMFAAQXkIUQqAsKKAgQIIykOIUgCEFQUMFEBQHkKUAiCsKGCgAILyEKIUAGFFAQMFEJSHEKUACCsKGCiAoDyEKAVAWFHAQAEE5SFEKQDCigIGGAHKPn27MbG5uSXowrgo1L+Pb56aa3w2vzRv3IoC4Hq/19+Sm9UluMSholr+ffz7UPjF1dGJt4d6Ih46aKC3OL+60pNSZ3cdWgRYi+5MXPgw8shuGKTrT1eUtKbGJ+TbzaRFgH2I7uByS9P32RG7gRCu316QXVLry2jWwaJNgEgstlo7PvOgbym0ogPspN6jxutJ7y7MaXM5nWk6GLQJsA+zsRtbfDr3s6tjLjilA+6k3eN+li/3XlZmY1Kc84yuZ9cqwD7UrmXtLUQiA5/Dvwf7ltYmh9bXw8FIdEcX8P90H58rPiHgdqfUeFPzSt3JZecSXZfjLMuh8xm1C6ATjvdSN0AB1B1Bn6AA0POq4SiAuiPoExQAel41HAVQdwR9ggJAz6uGowDqjqBPUADoedVwFEDdEfQJCgA9rxqOAqg7gj5BAaDnVcNRAHVH0CcoAPS8ajgKoO4I+gQFgJ5XDUcB1B1Bn6AA0POq4SiAuiPoExQAel41HAVQdwR9ggJAz6uGowDqjqBPUADoedVwfwBQecyfEzE1AgAAAABJRU5ErkJggg==';
/* eslint-enable max-len */

setIconIfNeeded();

function setIconIfNeeded() {
  if (isDevelopment()) {
    const link = document.querySelector('link[rel*="icon"]');
    const faviconUrl = link ? link.href : '/favicon.ico';

    Promise.all([getImg(faviconUrl), getImg(OVERLAY_URL)])
      .then(combineImages)
      .then(changeFavicon);
  }
}

/**
 * Returns true if the site is detected to be on a development domain.
 * @return {Boolean}
 */
function isDevelopment() {
  const hostname = window.location.hostname;
  return hostname === 'localhost'
    || hostname === '127.0.0.1'
    || hostname.substr(hostname.length - 4) === '.dev';
}

/**
 * Changes the favicon in the DOM, by trying to find a link with rel="icon".
 * If it doesn't find one, it creates one.
 * @param  {string}
 */
function changeFavicon(src) {
  let link = document.querySelector('link[rel*="icon"]');

  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }

  link.href = src;
}

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

/**
 * Async function. Returns a promise of a blob for the combined image
 * @param  {Array<Image>} images
 * @return {Promise<string>}
 */
function combineImages(images) {
  if (images.length < 2) return Promise.reject('Not enough images');

  return new Promise((resolve) => {
    // const canvas = document.querySelector('#favicon');
    const canvas = document.createElement('canvas'); // TODO
    const ctx = canvas.getContext('2d');
    const firstImage = images[0];
    canvas.width = firstImage.width;
    canvas.height = firstImage.height;

    images.forEach(img => ctx.drawImage(img, 0, 0, firstImage.width, firstImage.height));

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      resolve(url);
    });
  });
}
