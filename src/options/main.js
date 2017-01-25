import { DEFAULT_REGEX_STRING } from '../shared/options';

function render(state) {
  console.log('render', state);
  const hostnameRegex = document.querySelector('input[name="hostname-regex"]');

  if (hostnameRegex) hostnameRegex.value = state.hostnameRegex;
}

function loadOptions() {
  console.log('Load options!');
  return new Promise(resolve => {
    chrome.storage.sync.get({
      hostnameRegex: DEFAULT_REGEX_STRING,
    }, data => {
      console.log('data', data);
      resolve(data);
    });
  });
}
console.log('Starting...');

loadOptions().then(render);
