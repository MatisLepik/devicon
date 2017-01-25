export default function init() {
  document.getElementById('js-close-error').addEventListener('click', hideErrors);
}

export function showError(msg = '') {
  const error = document.getElementById('js-error');
  error.querySelector('.msg').innerHTML = msg;
  error.classList.add('is-visible');
}

export function hideErrors() {
  const error = document.getElementById('js-error');
  error.classList.remove('is-visible');
}
