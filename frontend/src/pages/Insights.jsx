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
    <div className="min-vh-100 bg-dark text-white p-4">
      <div className="container">
        <h1 className="text-center mb-4">🧠 AI Market Insights</h1>

        <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() => handleGenerateInsights('gpt-3.5-turbo')}
          >
            Generate Insight - gpt-3.5-turbo
          </button>
          <button
            className="btn btn-secondary"
            disabled={loading}
            onClick={() => handleGenerateInsights('gpt-4-1106-preview')}
          >
            Generate Insight - gpt-4o-mini
          </button>
          <button
            className="btn btn-success"
            disabled={loading}
            onClick={() => handleGenerateInsights('gpt-4o')}
          >
            Generate Insight - gpt-4o
          </button>
        </div>

        {selectedModel && (
          <p className="text-center text-light mb-3">
            Answer using: <strong>{selectedModel}</strong>
          </p>
        )}

        {insight && (
          <div className="bg-secondary text-light p-3 rounded overflow-auto" style={{ maxHeight: '600px' }}>
            <ReactMarkdown>{insight}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default Insights;
