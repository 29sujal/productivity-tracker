const RULE_ID_BASE = 10000;

function normalizeSite(site) {
  return site
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .toLowerCase()
    .split('/')[0];
}

async function updateBlockingRules() {
  try {
    const response = await fetch('http://localhost:5000/api/blocked');
    const data = await response.json();

    const uniqueSites = [...new Set(data.map(entry => normalizeSite(entry.site)))];

    const rules = uniqueSites.map((hostname, index) => ({
      id: RULE_ID_BASE + index,
      priority: 1,
      action: { type: 'block' },
      condition: {
        regexFilter: `^https?:\\/\\/(.*\\.)?${hostname.replace(/\./g, '\\.')}(\\/.*)?$`,
        resourceTypes: ['main_frame']
      }
    }));

    const oldRuleIds = Array.from({ length: 100 }, (_, i) => RULE_ID_BASE + i);

    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
      removeRuleIds: oldRuleIds
    });

    console.log('[DNR] Block rules updated:', rules.map(r => r.condition.regexFilter));
  } catch (err) {
    console.error('[DNR] Error updating rules:', err);
  }
}

chrome.runtime.onInstalled.addListener(() => updateBlockingRules());
setInterval(updateBlockingRules, 60000);

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (
    msg === 'refreshRules' ||
    (typeof msg === 'object' && msg.type === 'REFRESH_BLOCK_RULES')
  ) {
    updateBlockingRules();
    sendResponse({ success: true });
    return true; // ✅ Needed to keep listener alive for async
  }

  if (msg?.type === 'TRACK_USAGE') {
    const { url, duration } = msg.payload;
    fetch('http://localhost:5000/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, duration })
    })
      .then(() => {
        console.log(`[TRACK] ${url} - ${duration}ms`);
        sendResponse({ success: true });
      })
      .catch(err => {
        console.error('[TRACK] Failed:', err);
        sendResponse({ success: false, error: err.toString() });
      });

    return true; // ✅ CRUCIAL: ensures Chrome waits for sendResponse
  }
});
