chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: "launcher/anchor.html" });
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'onboarding/onboarding.html' });
  }
});
