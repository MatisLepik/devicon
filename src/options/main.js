import { defaults } from '../shared/options';
import initErrors, { showError, hideErrors } from './errors';

function render(state) {
  Object.keys(state).forEach(key => {
    const input = document.querySelector(`input[name="${key}"]`);
    if (input) input.value = state[key];
  });
}

function loadOptions() {
  return new Promise(resolve => {
    chrome.storage.sync.get(defaults, resolve);
  });
}

function validateRegex(str) {
  new RegExp(str); // eslint-disable-line no-new, reason: easiest way to check if string is valid regex :P
}

function save(evt) {
  evt.preventDefault();
  const hostnameRegex = document.querySelector('input[name="hostnameRegex"]');

  try {
    validateRegex(hostnameRegex.value);
  } catch (err) {
    showError(err.message || 'Invalid input');
    return;
  }

  document.getElementById('js-options-form').classList.remove('is-touched');

  const optionMap = {};
  Object.keys(defaults).forEach(key => {
    optionMap[key] = document.querySelector(`input[name="${key}"]`).value;
  });

  // Loop through all the options and set their values
  chrome.storage.sync.set(optionMap, () => showSavedAnim('js-save'));
}

function showSavedAnim(target) {
  const saveBtn = document.getElementById(target);
  saveBtn.classList.add('is-saved');
  setTimeout(() => saveBtn.classList.remove('is-saved'), 1500);
}

function reset() {
  document.getElementById('js-options-form').classList.add('is-touched');
  render(defaults);
}

function onInput() {
  hideErrors();
  document.getElementById('js-options-form').classList.add('is-touched');
}

loadOptions().then(render);
initErrors();
document.getElementById('js-options-form').addEventListener('submit', save);
document.getElementById('js-options-form').addEventListener('input', onInput);
document.getElementById('js-reset').addEventListener('click', reset);
