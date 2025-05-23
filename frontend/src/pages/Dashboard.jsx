import React, { useEffect, useState } from 'react';
import { getMarketData } from '../services/api';

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    getMarketData().then((data) => {
      const ranked = [...data]
        .sort((a, b) => b.market_cap - a.market_cap)
        .map((coin, index) => ({ ...coin, rank: index + 1 }));
      setCoins(ranked);
    });
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedCoins = [...coins].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField] ?? 0;
    const valB = b[sortField] ?? 0;
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const renderArrow = (field) => {
    if (sortField !== field) return '';
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

  const formatCompactUSD = (number) => {
    if (!number || isNaN(number)) return '-';
    const abs = Math.abs(number);
    if (abs >= 1e12) return `$ ${(number / 1e12).toFixed(2)}T`;
    if (abs >= 1e9) return `$ ${(number / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `$ ${(number / 1e6).toFixed(2)}M`;
    if (abs >= 1e3) return `$ ${(number / 1e3).toFixed(2)}K`;
    return `$ ${number.toFixed(2)}`;
  };

  return (
    <div style={{
      backgroundColor: '#111827',
      color: '#F9FAFB',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>🚀 Crypto Market Overview</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#1F2937', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Rank</th>
            <th style={{ padding: '12px' }}>Name</th>
            <th style={{ padding: '12px' }}>Price (USD)</th>
            <th onClick={() => handleSort('market_cap')} style={{ padding: '12px', cursor: 'pointer' }}>
              Market Cap{renderArrow('market_cap')}
            </th>
            <th onClick={() => handleSort('volume')} style={{ padding: '12px', cursor: 'pointer' }}>
              24h Volume{renderArrow('volume')}
            </th>
            <th onClick={() => handleSort('percent_change_1d')} style={{ padding: '12px', cursor: 'pointer' }}>
              1d Change %{renderArrow('percent_change_1d')}
            </th>
            <th onClick={() => handleSort('percent_change_7d')} style={{ padding: '12px', cursor: 'pointer' }}>
              7d Change %{renderArrow('percent_change_7d')}
            </th>
            <th onClick={() => handleSort('percent_change_30d')} style={{ padding: '12px', cursor: 'pointer' }}>
              30d Change %{renderArrow('percent_change_30d')}
            </th>
            <th onClick={() => handleSort('percent_change_90d')} style={{ padding: '12px', cursor: 'pointer' }}>
              90d Change %{renderArrow('percent_change_90d')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCoins.map((coin) => (
            <tr key={coin.id} style={{ borderBottom: '1px solid #374151' }}>
              <td style={{ padding: '10px' }}>{coin.rank}</td>
              <td style={{ padding: '10px' }}>{coin.name} ({coin.symbol})</td>
              <td style={{ padding: '10px' }}>${coin.price.toFixed(2)}</td>
              <td style={{ padding: '10px' }}>{formatCompactUSD(coin.market_cap)}</td>
              <td style={{ padding: '10px' }}>{formatCompactUSD(coin.volume)}</td>
              <td style={{
                padding: '10px',
                color: coin.percent_change_1d > 0 ? '#10B981' : '#EF4444'
              }}>
                {coin.percent_change_1d?.toFixed(2)}%
              </td>
              <td style={{
                padding: '10px',
                color: coin.percent_change_7d > 0 ? '#10B981' : '#EF4444'
              }}>
                {coin.percent_change_7d?.toFixed(2)}%
              </td>
              <td style={{
                padding: '10px',
                color: coin.percent_change_30d > 0 ? '#10B981' : '#EF4444'
              }}>
                {coin.percent_change_30d?.toFixed(2)}%
              </td>
              <td style={{
                padding: '10px',
                color: coin.percent_change_90d > 0 ? '#10B981' : '#EF4444'
              }}>
                {coin.percent_change_90d?.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
