import { DEFAULT_REGEX_STRING } from '../shared/options';

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

function save(evt) {
  evt.preventDefault();
  const hostnameRegex = document.querySelector('input[name="hostname-regex"]');

  if (!hostnameRegex) return;

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
document.getElementById('js-options-form').addEventListener('submit', save);
document.getElementById('js-reset').addEventListener('click', reset);
