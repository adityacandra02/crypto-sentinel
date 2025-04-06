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
      backgroundColor: '#0D1117',
      color: '#E6EDF3',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h1 style={{
        fontSize: '2rem',
        marginBottom: '2rem',
        textAlign: 'center',
        color: '#58A6FF'
      }}>
        📈 Crypto Market Dashboard
      </h1>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#161B22' }}>
              {['Rank', 'Name', 'Price (USD)'].map(col => (
                <th key={col} style={{ padding: '12px', borderBottom: '1px solid #30363D' }}>{col}</th>
              ))}
              {[
                { field: 'market_cap', label: 'Market Cap' },
                { field: 'volume', label: '24h Volume' },
                { field: 'percent_change_1d', label: '1d Change %' },
                { field: 'percent_change_7d', label: '7d Change %' },
                { field: 'percent_change_30d', label: '30d Change %' },
                { field: 'percent_change_90d', label: '90d Change %' },
              ].map(({ field, label }) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #30363D' }}
                >
                  {label}{renderArrow(field)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map((coin) => (
              <tr key={coin.id} style={{ borderBottom: '1px solid #30363D' }}>
                <td style={{ padding: '10px' }}>{coin.rank}</td>
                <td style={{ padding: '10px' }}>{coin.name} ({coin.symbol})</td>
                <td style={{ padding: '10px' }}>${coin.price.toFixed(2)}</td>
                <td style={{ padding: '10px' }}>{formatCompactUSD(coin.market_cap)}</td>
                <td style={{ padding: '10px' }}>{formatCompactUSD(coin.volume)}</td>
                {['percent_change_1d', 'percent_change_7d', 'percent_change_30d', 'percent_change_90d'].map((key) => (
                  <td
                    key={key}
                    style={{
                      padding: '10px',
                      color: coin[key] >= 0 ? '#3FB950' : '#F85149'
                    }}
                  >
                    {coin[key]?.toFixed(2)}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
