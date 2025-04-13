import React, { useEffect, useState } from 'react';

function Summaries() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [storingNews, setStoringNews] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/fetchSummaries');
      const data = await response.json();
      setSummaries(data.summaries || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load summaries.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const response = await fetch('/.netlify/functions/summarizeDailyNewsButton', {
        method: 'POST',
      });
      const data = await response.json();
      alert(data.message || 'Summarization complete.');
      fetchSummaries();
    } catch (err) {
      console.error(err);
      alert('Failed to regenerate summaries.');
    } finally {
      setRegenerating(false);
    }
  };

  const handleStoreNews = async () => {
    setStoringNews(true);
    try {
      const response = await fetch('/.netlify/functions/triggerStoreNews', {
        method: 'POST',
      });
      const data = await response.json();
      alert(data.message || 'News stored successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to store news.');
    } finally {
      setStoringNews(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      color: '#f9fafb',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📊 Daily AI News Summaries</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={handleStoreNews}
          disabled={storingNews}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {storingNews ? 'Storing news...' : '📰 Store News Now'}
        </button>

        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {regenerating ? 'Regenerating...' : '🔁 Regenerate Summaries'}
        </button>
      </div>

      {loading ? (
        <p>Loading summaries...</p>
      ) : error ? (
        <p>{error}</p>
      ) : summaries.length === 0 ? (
        <p>No summaries available.</p>
      ) : (
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {summaries.map((entry, idx) => (
            <div key={idx} style={{
              backgroundColor: '#1f2937',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              lineHeight: '1.5',
            }}>
              <strong>{entry.coin}</strong> — <em>{entry.date}</em>
              <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{entry.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summaries;
