// frontend/src/pages/WatchlistInsight.jsx
import React, { useState, useEffect } from 'react';

function WatchlistInsight() {
  const [coins, setCoins] = useState([]);
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    fetch('/.netlify/functions/fetchWatchlistData')
      .then(res => res.json())
      .then(setCoins)
      .catch(() => setCoins([]));
  }, []);

  const handleGenerateInsights = async (model) => {
    setLoading(true);
    setInsight('');
    setSelectedModel(model);
    try {
      const response = await fetch('/.netlify/functions/analyzeWithLLMWatchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filteredCoins: coins, model }),
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
    <div style={{
      backgroundColor: '#111827',
      color: '#F9FAFB',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📌 Watchlist Insights</h1>

      <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={() => handleGenerateInsights('gpt-3.5-turbo')}
          disabled={loading}
          style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px', borderRadius: '5px' }}
        >
          Generate Insight - gpt-3.5-turbo
        </button>
        <button
          onClick={() => handleGenerateInsights('gpt-4-1106-preview')}
          disabled={loading}
          style={{ backgroundColor: '#9333ea', color: 'white', padding: '10px', borderRadius: '5px' }}
        >
          Generate Insight - gpt-4o-mini
        </button>
        <button
          onClick={() => handleGenerateInsights('gpt-4o')}
          disabled={loading}
          style={{ backgroundColor: '#10b981', color: 'white', padding: '10px', borderRadius: '5px' }}
        >
          Generate Insight - gpt-4o
        </button>
      </div>

      {selectedModel && (
        <p style={{ marginBottom: '1rem', color: '#9CA3AF' }}>
          Answer generated using: <strong>{selectedModel}</strong>
        </p>
      )}

      {insight && (
        <div style={{
          backgroundColor: '#1F2937',
          padding: '1.25rem',
          borderRadius: '8px',
          whiteSpace: 'pre-wrap',
          overflowY: 'auto',
          maxHeight: '600px'
        }}>
          {insight}
        </div>
      )}
    </div>
  );
}

export default WatchlistInsight;
