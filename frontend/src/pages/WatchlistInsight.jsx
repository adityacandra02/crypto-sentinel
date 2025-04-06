import React, { useState, useEffect } from 'react';
import { getWatchlistData } from '../services/api';

function WatchlistInsight() {
  const [coins, setCoins] = useState([]);
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    getWatchlistData().then(setCoins);
  }, []);

  const handleGenerateInsights = async (model) => {
    setLoading(true);
    setInsight('');
    setSelectedModel(model);
    try {
      const response = await fetch('/.netlify/functions/analyzeWithLLMWatchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coins, model }),
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
      <h1 className="text-2xl font-bold mb-4">📈 Watchlist Insights</h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => handleGenerateInsights('gpt-3.5-turbo')}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          GPT-3.5
        </button>
        <button
          onClick={() => handleGenerateInsights('gpt-4-1106-preview')}
          className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          GPT-4o Mini
        </button>
        <button
          onClick={() => handleGenerateInsights('gpt-4o')}
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          GPT-4o
        </button>
      </div>

      {selectedModel && (
        <p className="mb-2 text-gray-400">Answer: {selectedModel}</p>
      )}

      {insight && (
        <div className="bg-gray-800 p-4 mt-4 rounded shadow-inner overflow-y-auto max-h-[600px]">
          <pre className="whitespace-pre-wrap leading-relaxed text-gray-200">{insight}</pre>
        </div>
      )}
    </div>
  );
}

export default WatchlistInsight;
