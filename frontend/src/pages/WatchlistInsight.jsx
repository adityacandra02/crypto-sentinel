import React, { useEffect, useState } from 'react';
import { getWatchlistData } from '../services/api';

function WatchlistInsight() {
  const [coins, setCoins] = useState([]);
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    getWatchlistData().then((data) => setCoins(data));
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
      console.error('Insight generation error:', error);
      setInsight('Error generating insight.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      color: 'white',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>🔍 AI Watchlist Insight</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => handleGenerateInsights('gpt-3.5-turbo')}
          style={{
            backgroundColor: '#2563EB',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          {loading && selectedModel === 'gpt-3.5-turbo' ? 'Analyzing...' : 'gpt-3.5-turbo'}
        </button>
        <button
          onClick={() => handleGenerateInsights('gpt-4-1106-preview')}
          style={{
            backgroundColor: '#9333EA',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          {loading && selectedModel === 'gpt-4-1106-preview' ? 'Analyzing...' : 'gpt-4o-mini'}
        </button>
        <button
          onClick={() => handleGenerateInsights('gpt-4o')}
          style={{
            backgroundColor: '#10B981',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          {loading && selectedModel === 'gpt-4o' ? 'Analyzing...' : 'gpt-4o'}
        </button>
      </div>

      {selectedModel && (
        <p style={{ marginBottom: '1rem', color: '#9CA3AF' }}>
          Answer using: <strong>{selectedModel}</strong>
        </p>
      )}

      {insight && (
        <div style={{
          backgroundColor: '#1F2937',
          padding: '1rem',
          borderRadius: '6px',
          overflowY: 'auto',
          maxHeight: '600px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: '1.6',
          fontSize: '0.95rem'
        }}>
          {insight}
        </div>
      )}
    </div>
  );
}

export default WatchlistInsight;
