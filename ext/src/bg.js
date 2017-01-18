chrome.runtime.onMessage.addListener((request, sender) => {
  if (request === 'showPageAction') {
    chrome.pageAction.show(sender.tab.id);
  }
});
