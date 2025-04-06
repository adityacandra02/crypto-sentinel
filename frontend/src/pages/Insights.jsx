import React, { useState, useEffect } from 'react';
import { getMarketData } from '../services/api';

function Insights() {
  const [coins, setCoins] = useState([]);
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMarketData().then((data) => setCoins(data));
  }, []);

  const handleGenerateInsights = async () => {
    setLoading(true);
    setInsight('');
    try {
      const response = await fetch('/.netlify/functions/analyzeWithLLM', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coins }),
      });
      const data = await response.json();
      setInsight(data.insight || 'No insight received.');
    } catch (error) {
      setInsight('Error generating insight.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🧠 AI Market Insights</h1>
        <button
          onClick={handleGenerateInsights}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      {insight && (
        <div className="bg-gray-800 p-4 mt-4 rounded shadow-inner">
          <pre className="whitespace-pre-wrap leading-relaxed text-gray-200">
            {insight}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Insights;
