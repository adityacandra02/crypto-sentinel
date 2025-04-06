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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '1.5rem',
      fontFamily: 'sans-serif',
      overflowX: 'hidden'
    }}>
      <h1 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '1.5rem' }}>
        🧠 AI Market Insights
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => handleGenerateInsights('gpt-3.5-turbo')}
          style={{
            backgroundColor: '#2563eb',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.375rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
            border: 'none',
            color: 'white'
          }}
          disabled={loading}
        >
          Generate Insight - gpt-3.5-turbo
        </button>
        <button
          onClick={() => handleGenerateInsights('gpt-4-1106-preview')}
          style={{
            backgroundColor: '#7c3aed',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.375rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
            border: 'none',
            color: 'white'
          }}
          disabled={loading}
        >
          Generate Insight - gpt-4o-mini
        </button>
        <button
          onClick={() => handleGenerateInsights('gpt-4o')}
          style={{
            backgroundColor: '#059669',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.375rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
            border: 'none',
            color: 'white'
          }}
          disabled={loading}
        >
          Generate Insight - gpt-4o
        </button>
      </div>

      {selectedModel && (
        <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#cbd5e1' }}>
          Answer using: <strong>{selectedModel}</strong>
        </p>
      )}

      {insight && (
        <div style={{
          backgroundColor: '#1e293b',
          padding: '1rem',
          borderRadius: '0.5rem',
          maxHeight: '600px',
          overflowY: 'auto',
          overflowX: 'hidden',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: '1.6'
        }}>
          <ReactMarkdown>{insight}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default Insights;
