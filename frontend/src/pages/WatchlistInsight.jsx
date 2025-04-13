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
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>🧠 AI Watchlist Insights</h1>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          onClick={() => handleGenerateInsights('gpt-3.5-turbo')}
          disabled={loading}
          style={{ backgroundColor: '#2563eb', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}
        >
          {loading && selectedModel === 'gpt-3.5-turbo' ? 'Analyzing...' : 'Generate Insight - gpt-3.5-turbo'}
        </button>
        <button
          onClick={() => handleGenerateInsights('gpt-4-1106-preview')}
          disabled={loading}
          style={{ backgroundColor: '#7c3aed', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}
        >
          {loading && selectedModel === 'gpt-4-1106-preview' ? 'Analyzing...' : 'Generate Insight - gpt-4o-mini'}
        </button>
        <button
          onClick={() => handleGenerateInsights('gpt-4o')}
          disabled={loading}
          style={{ backgroundColor: '#059669', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem' }}
        >
          {loading && selectedModel === 'gpt-4o' ? 'Analyzing...' : 'Generate Insight - gpt-4o'}
        </button>
      </div>

      {selectedModel && (
        <p style={{ marginBottom: '1rem', color: '#9ca3af' }}>
          Answer model: <strong>{selectedModel}</strong>
        </p>
      )}

      {insight && (
        <div
          style={{
            backgroundColor: '#1e293b',
            padding: '1rem',
            borderRadius: '8px',
            maxHeight: '600px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            overflowX: 'hidden',
            lineHeight: '1.5',
            color: '#d1d5db'
          }}
        >
          {insight}
        </div>
      )}
    </div>
  );
}

export default WatchlistInsight;
