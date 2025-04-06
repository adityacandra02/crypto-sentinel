import React, { useState, useEffect } from 'react';
import { getMarketData } from '../services/api';
import ReactMarkdown from 'react-markdown';

function Insights() {
  const [coins, setCoins] = useState([]);
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    getMarketData().then((data) => setCoins(data));
  }, []);

  const handleGenerateInsights = async (model) => {
    setLoading(true);
    setInsight('');
    setSelectedModel(model);
    try {
      const response = await fetch('/.netlify/functions/analyzeWithLLM', {
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
    <div className="min-h-screen bg-[#0f172a] text-white p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">🧠 AI Market Insights</h1>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <button
          onClick={() => handleGenerateInsights('gpt-3.5-turbo')}
          className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded text-sm"
          disabled={loading}
        >
          Generate Insight - gpt-3.5-turbo
        </button>
        <button
          onClick={() => handleGenerateInsights('gpt-4-1106-preview')}
          className="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded text-sm"
          disabled={loading}
        >
          Generate Insight - gpt-4o-mini
        </button>
        <button
          onClick={() => handleGenerateInsights('gpt-4o')}
          className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded text-sm"
          disabled={loading}
        >
          Generate Insight - gpt-4o
        </button>
      </div>

      {selectedModel && (
        <p className="mb-3 text-gray-300 text-center">Answer using: <span className="font-semibold">{selectedModel}</span></p>
      )}

      {insight && (
        <div className="bg-gray-800 p-4 rounded shadow-inner max-h-[600px] overflow-y-auto prose prose-invert">
          <ReactMarkdown>{insight}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default Insights;
