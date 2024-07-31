

chrome.action.onClicked.addListener((tab) => {
  chrome.windows.create({
    url: chrome.runtime.getURL("src/pages/popup/popup.html"),
    type: "popup",
    width: 500,
    height:1000
  });
});