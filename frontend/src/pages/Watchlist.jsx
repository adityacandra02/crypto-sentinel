// frontend/src/pages/Watchlist.jsx
import React, { useEffect, useState } from 'react';
import { getWatchlistData } from '../services/api';


function Watchlist() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWatchlistData().then((data) => {
      setCoins(data);
      setLoading(false);
    });
  }, []);

  const formatUSD = (num) => {
    if (!num || isNaN(num)) return '-';
    const abs = Math.abs(num);
    if (abs >= 1e12) return `$ ${(num / 1e12).toFixed(2)}T`;
    if (abs >= 1e9) return `$ ${(num / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `$ ${(num / 1e6).toFixed(2)}M`;
    return `$ ${num.toFixed(2)}`;
  };

  return (
    <div style={{ backgroundColor: '#111827', color: '#F9FAFB', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>👀 Watchlist</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead style={{ backgroundColor: '#1F2937', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Price</th>
              <th style={{ padding: '12px' }}>Market Cap</th>
              <th style={{ padding: '12px' }}>24h Volume</th>
              <th style={{ padding: '12px' }}>1d %</th>
              <th style={{ padding: '12px' }}>7d %</th>
              <th style={{ padding: '12px' }}>30d %</th>
              <th style={{ padding: '12px' }}>90d %</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.id} style={{ borderBottom: '1px solid #374151' }}>
                <td style={{ padding: '10px' }}>{coin.name} ({coin.symbol})</td>
                <td style={{ padding: '10px' }}>${coin.price.toFixed(2)}</td>
                <td style={{ padding: '10px' }}>{formatUSD(coin.market_cap)}</td>
                <td style={{ padding: '10px' }}>{formatUSD(coin.volume)}</td>
                <td style={{ padding: '10px', color: coin.percent_change_1d >= 0 ? '#10B981' : '#EF4444' }}>
                  {coin.percent_change_1d?.toFixed(2)}%
                </td>
                <td style={{ padding: '10px', color: coin.percent_change_7d >= 0 ? '#10B981' : '#EF4444' }}>
                  {coin.percent_change_7d?.toFixed(2)}%
                </td>
                <td style={{ padding: '10px', color: coin.percent_change_30d >= 0 ? '#10B981' : '#EF4444' }}>
                  {coin.percent_change_30d?.toFixed(2)}%
                </td>
                <td style={{ padding: '10px', color: coin.percent_change_90d >= 0 ? '#10B981' : '#EF4444' }}>
                  {coin.percent_change_90d?.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Watchlist;
