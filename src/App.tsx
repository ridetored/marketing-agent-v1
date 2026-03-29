/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [strategy, setStrategy] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState({
    gemini: localStorage.getItem('GEMINI_API_KEY') || '',
    googleAds: localStorage.getItem('GOOGLE_ADS_API_KEY') || '',
    meta: localStorage.getItem('META_API_KEY') || '',
  });

  const saveKeys = () => {
    localStorage.setItem('GEMINI_API_KEY', keys.gemini);
    localStorage.setItem('GOOGLE_ADS_API_KEY', keys.googleAds);
    localStorage.setItem('META_API_KEY', keys.meta);
    alert('Keys saved!');
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch('/api/ads-data', {
      headers: {
        'X-Google-Ads-API-Key': keys.googleAds,
        'X-Meta-API-Key': keys.meta,
      }
    });
    const result = await response.json();
    setData(result);
    setLoading(false);
  };

  const getStrategy = async () => {
    setLoading(true);
    const response = await fetch('/api/ai-strategy', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Gemini-API-Key': keys.gemini,
      },
      body: JSON.stringify({ data }),
    });
    const result = await response.json();
    setStrategy(result.strategy);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">🚀 Autonomous Ad Command Center</h1>
      
      <div className="mb-4 p-4 bg-yellow-100 rounded">
        <h2 className="text-lg font-bold">API Configuration (Stored in Browser)</h2>
        <input type="password" placeholder="Gemini API Key" value={keys.gemini} onChange={e => setKeys({...keys, gemini: e.target.value})} className="block w-full p-2 mb-2 border" />
        <input type="password" placeholder="Google Ads API Key" value={keys.googleAds} onChange={e => setKeys({...keys, googleAds: e.target.value})} className="block w-full p-2 mb-2 border" />
        <input type="password" placeholder="Meta API Key" value={keys.meta} onChange={e => setKeys({...keys, meta: e.target.value})} className="block w-full p-2 mb-2 border" />
        <button onClick={saveKeys} className="bg-gray-500 text-white p-2 rounded">Save Keys</button>
      </div>

      <button onClick={fetchData} className="bg-blue-500 text-white p-2 rounded mr-2">Fetch Data</button>
      <button onClick={getStrategy} className="bg-green-500 text-white p-2 rounded">Get AI Strategy</button>
      
      {loading && <p>Loading...</p>}
      
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Campaign</th>
            <th className="border border-gray-300 p-2">Spend</th>
            <th className="border border-gray-300 p-2">Conv</th>
            <th className="border border-gray-300 p-2">Platform</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td className="border border-gray-300 p-2">{row.Campaign}</td>
              <td className="border border-gray-300 p-2">{row.Spend}</td>
              <td className="border border-gray-300 p-2">{row.Conv}</td>
              <td className="border border-gray-300 p-2">{row.Platform}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {strategy && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold">AI Strategic Analysis</h2>
          <p>{strategy}</p>
        </div>
      )}
    </div>
  );
}
