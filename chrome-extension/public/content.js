let startTime = Date.now();

window.addEventListener('beforeunload', () => {
  const endTime = Date.now();
  const duration = endTime - startTime;
  const url = location.hostname;

  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage(
      {
        type: 'TRACK_USAGE',
        payload: { url, duration }
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.warn('Send error:', chrome.runtime.lastError.message);
        } else {
          console.log('Tracking sent:', response);
        }
      }
    );
  }
});
