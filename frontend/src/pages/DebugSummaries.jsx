// frontend/src/pages/DebugSummaries.jsx
import React, { useState } from 'react';

function DebugSummaries() {
  const [loading, setLoading] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);

  const handleFetchCryptoPanicNews = async () => {
    setLoading(true);
    setDebugLogs([]);
    try {
      const response = await fetch('/.netlify/functions/triggerStoreNews');
      const data = await response.json();
      setDebugLogs(data.logs || []);
    } catch (err) {
      console.error('Debug CryptoPanic Fetch Error:', err);
      setDebugLogs([{ status: 'error', reason: 'Fetch failed' }]);
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
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>🐞 Debug CryptoPanic News Fetch</h1>

      <button
        onClick={handleFetchCryptoPanicNews}
        style={{
          backgroundColor: '#3B82F6',
          padding: '0.5rem 1.5rem',
          borderRadius: '6px',
          fontSize: '1rem',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
        disabled={loading}
      >
        {loading ? 'Fetching...' : 'Fetch CryptoPanic News Now'}
      </button>

      {debugLogs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>🧾 Logs</h2>
          <pre style={{
            backgroundColor: '#1f2937',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
            maxHeight: '500px',
            overflowY: 'auto',
            fontSize: '0.9rem'
          }}>
            {JSON.stringify(debugLogs, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default DebugSummaries;
