import React, { useEffect, useState } from 'react';

function Summaries() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/fetchSummaries');
      const data = await response.json();
      setSummaries(data || []);
    } catch (error) {
      console.error('Error fetching summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerSummarizeDaily = async () => {
    setSummarizing(true);
    try {
      const response = await fetch('/.netlify/functions/summarizeNewsDaily', {
        method: 'POST',
      });
      const data = await response.json();
      console.log('Summarize News Daily result:', data);
      alert('Daily summarization triggered!');
      fetchSummaries(); // Refresh after summarizing
    } catch (error) {
      console.error('Error triggering summarize daily:', error);
      alert('Failed to summarize news.');
    } finally {
      setSummarizing(false);
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
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📰 Daily Crypto Summaries</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={fetchSummaries}
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
          {loading ? 'Refreshing...' : 'Refresh Summaries'}
        </button>

        <button
          onClick={triggerSummarizeDaily}
          style={{
            backgroundColor: '#10B981',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
          disabled={summarizing}
        >
          {summarizing ? 'Summarizing...' : 'Summarize News Daily'}
        </button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        {summaries.length === 0 ? (
          <p>No summaries available.</p>
        ) : (
          summaries.map((item, index) => (
            <div key={index} style={{
              backgroundColor: '#1F2937',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              lineHeight: '1.6'
            }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.coin_symbol} ({item.date})</h2>
              <p>{item.summary}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Summaries;
