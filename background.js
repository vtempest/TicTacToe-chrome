chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('popup.html', {
	'minWidth': 180,
	'minHeight': 200,
	'maxWidth': 180,
	'maxHeight': 200
  });
});