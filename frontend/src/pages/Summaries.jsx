// frontend/src/pages/Summaries.jsx
import React, { useEffect, useState } from 'react';

function Summaries() {
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    fetch('/.netlify/functions/fetchSummaries')
      .then((res) => res.json())
      .then((data) => setSummaries(data || []));
  }, []);

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '2rem', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>📰 Daily Coin Summaries</h1>
      {summaries.map((item) => (
        <div key={`${item.coin}-${item.date}`} style={{ backgroundColor: '#1F2937', padding: '1rem', marginBottom: '1rem', borderRadius: '6px' }}>
          <h2>{item.coin} — {item.date}</h2>
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>{item.summary}</p>
        </div>
      ))}
    </div>
  );
}

export default Summaries;
