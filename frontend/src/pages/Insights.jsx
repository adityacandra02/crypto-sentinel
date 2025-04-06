import React, { useState, useEffect } from 'react';
import { getMarketData } from '../services/api';

const Insights = () => {
  const [coins, setCoins] = useState([]);
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMarketData().then(setCoins);
  }, []);

  const handleGenerateInsights = async () => {
    setLoading(true);
    setInsight('');
    try {
      const response = await fetch('/.netlify/functions/analyzeWithLLM', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coins })
      });
      const data = await response.json();
      setInsight(data.insight || 'No insight received.');
    } catch (err) {
      console.error('Insight fetch error:', err);
      setInsight('Failed to generate insights.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      backgroundColor: '#111827',
      color: '#F9FAFB',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>🧠 AI Market Insights</h1>
      <button
        onClick={handleGenerateInsights}
        disabled={loading}
        style={{
          backgroundColor: '#2563EB',
          color: '#F9FAFB',
          padding: '0.75rem 1.25rem',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '1.5rem'
        }}
      >
        {loading ? 'Analyzing...' : 'Generate Insights'}
      </button>

      <div style={{
        backgroundColor: '#1F2937',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        whiteSpace: 'pre-line',
        lineHeight: '1.6',
        fontSize: '1rem'
      }}>
        {insight || 'Click the button above to generate market insights.'}
      </div>
    </div>
  );
};

export default Insights;
