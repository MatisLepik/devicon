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

  chrome.storage.sync.set({
    hostnameRegex: hostnameRegex.value,
  }, () => showSavedAnim('js-save'));
}

function showSavedAnim(target) {
  const saveBtn = document.getElementById(target);
  saveBtn.classList.add('is-saved');
  setTimeout(() => saveBtn.classList.remove('is-saved'), 1500);
}

function reset() {
  chrome.storage.sync.set({
    hostnameRegex: DEFAULT_REGEX_STRING,
  }, () => {
    loadOptions().then(render);
    showSavedAnim('js-reset');
  });
}

loadOptions().then(render);
initErrors();
document.getElementById('js-options-form').addEventListener('submit', save);
document.getElementById('js-options-form').addEventListener('input', hideErrors);
document.getElementById('js-reset').addEventListener('click', reset);
