import { DEFAULT_REGEX_STRING } from '../shared/options';
import initErrors, { showError, hideErrors } from './errors';

function render(state) {
  const hostnameRegex = document.querySelector('input[name="hostname-regex"]');

  if (hostnameRegex) hostnameRegex.value = state.hostnameRegex;
}

function loadOptions() {
  return new Promise(resolve => {
    chrome.storage.sync.get({
      hostnameRegex: DEFAULT_REGEX_STRING,
    }, resolve);
  });
}

function validateRegex(str) {
  new RegExp(str); // eslint-disable-line no-new, reason: easiest way to check if string is valid regex :P
}

function save(evt) {
  evt.preventDefault();
  const hostnameRegex = document.querySelector('input[name="hostname-regex"]');

  try {
    validateRegex(hostnameRegex.value);
  } catch (err) {
    showError(err.message || 'Invalid input');
    return;
  }

  const saveBtn = document.getElementById('js-save');
  saveBtn.classList.add('is-saved');

  chrome.storage.sync.set({
    hostnameRegex: hostnameRegex.value,
  }, () => {
    setTimeout(() => {
      saveBtn.classList.remove('is-saved');
    }, 1500);
  });
}

function reset() {
  loadOptions().then(render);
}

reset();
initErrors();
document.getElementById('js-options-form').addEventListener('submit', save);
document.getElementById('js-options-form').addEventListener('input', hideErrors);
document.getElementById('js-reset').addEventListener('click', reset);
