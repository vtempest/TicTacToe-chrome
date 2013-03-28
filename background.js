chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('popup.html', {
    'width': 200,
    'height': 200
  });
});