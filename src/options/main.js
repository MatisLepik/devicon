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

function save() {
  console.log('save');
}

function reset() {
  loadOptions().then(render);
}

reset();
// document.getElementById('js-save').addEventListener('click', save);
document.getElementById('js-reset').addEventListener('click', reset);
