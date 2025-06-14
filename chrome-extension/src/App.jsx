import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:5000';

function App() {
  const [tab, setTab] = useState('block');
  const [site, setSite] = useState('');
  const [blockedSites, setBlockedSites] = useState([]);
  const [report, setReport] = useState([]);
  const [message, setMessage] = useState('');

  const fetchBlockedSites = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/blocked`);
      const data = await res.json();
      setBlockedSites(data);
    } catch {
      setMessage('❌ Failed to fetch blocked sites');
    }
  };

  const fetchReport = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/track/report`);
      const data = await res.json();
      const today = new Date().toDateString();
      const todayOnly = data.filter(d => new Date(d.date).toDateString() === today);

      const bySite = {};
      todayOnly.forEach(({ url, duration }) => {
        bySite[url] = (bySite[url] || 0) + duration;
      });

      const formatted = Object.entries(bySite).map(([url, ms]) => ({
        url,
        mins: (ms / 60000).toFixed(1),
      }));

      setReport(formatted);
    } catch {
      setMessage('❌ Failed to fetch report');
    }
  };

  const detectCurrentTabURL = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || typeof tab.url !== 'string') return;
      try {
        const url = new URL(tab.url);
        setSite(url.hostname);
      } catch { }
    });
  };

  const blockSite = async () => {
    if (!site.trim()) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/blocked`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site })
      });
      const data = await res.json();
      setMessage(data.message);
      setSite('');
      fetchBlockedSites();
      chrome.runtime.sendMessage({ type: 'REFRESH_BLOCK_RULES' });
    } catch {
      setMessage('❌ Error blocking site');
    }
  };

  const unblockSite = async (siteToRemove) => {
    try {
      await fetch(`${BACKEND_URL}/api/blocked/${encodeURIComponent(siteToRemove)}`, {
        method: 'DELETE',
      });
      fetchBlockedSites();
      chrome.runtime.sendMessage({ type: 'REFRESH_BLOCK_RULES' });
    } catch {
      setMessage('❌ Failed to unblock');
    }
  };

  useEffect(() => {
    if (tab === 'block') {
      fetchBlockedSites();
      detectCurrentTabURL();
    } else {
      fetchReport();
    }
  }, [tab]);

  return (
    <div className="p-4 w-80 font-sans text-sm text-gray-800">
      <div className="flex justify-around mb-3">
        <button onClick={() => setTab('block')} className={`px-2 py-1 rounded ${tab === 'block' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Block Sites</button>
        <button onClick={() => setTab('report')} className={`px-2 py-1 rounded ${tab === 'report' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Daily Report</button>
      </div>

      {tab === 'block' ? (
        <>
          <input
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="Enter site to block"
            className="w-full border rounded px-2 py-1 mb-2 outline-none focus:ring-2 ring-blue-500"
          />
          <button
            onClick={blockSite}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded"
          >
            Block Site
          </button>
          {message && <div className="mt-2 text-center text-green-600">{message}</div>}

          <h2 className="mt-4 font-semibold text-gray-700">Blocked Sites:</h2>
          <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto">
            {blockedSites.length === 0 && <li>No blocked sites</li>}
            {blockedSites.map((s, i) => (
              <li key={i} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
                <span>{s.site}</span>
                <button
                  onClick={() => unblockSite(s.site)}
                  className="text-red-600 hover:text-red-800 text-xs font-medium"
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2 className="text-center font-semibold mb-2">Time Spent Today</h2>
          <ul className="space-y-1 max-h-52 overflow-y-auto">
            {report.length === 0 && <li className="text-center">No data</li>}
            {report.map((r, i) => (
              <li key={i} className="flex justify-between bg-gray-100 px-2 py-1 rounded">
                <span>{r.url}</span>
                <span className="font-medium">{r.mins} min</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
