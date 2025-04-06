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
    <div className="bg-dark text-light min-vh-100 py-5 px-4">
      <h1 className="text-center mb-4">🚀 Crypto Market Overview</h1>

      <div className="table-responsive">
        <table className="table table-dark table-hover table-bordered table-sm align-middle">
          <thead className="table-light text-dark">
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Price (USD)</th>
              <th onClick={() => handleSort('market_cap')} style={{ cursor: 'pointer' }}>
                Market Cap {renderArrow('market_cap')}
              </th>
              <th onClick={() => handleSort('volume')} style={{ cursor: 'pointer' }}>
                24h Volume {renderArrow('volume')}
              </th>
              <th onClick={() => handleSort('percent_change_1d')} style={{ cursor: 'pointer' }}>
                1d % {renderArrow('percent_change_1d')}
              </th>
              <th onClick={() => handleSort('percent_change_7d')} style={{ cursor: 'pointer' }}>
                7d % {renderArrow('percent_change_7d')}
              </th>
              <th onClick={() => handleSort('percent_change_30d')} style={{ cursor: 'pointer' }}>
                30d % {renderArrow('percent_change_30d')}
              </th>
              <th onClick={() => handleSort('percent_change_90d')} style={{ cursor: 'pointer' }}>
                90d % {renderArrow('percent_change_90d')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map((coin) => (
              <tr key={coin.id}>
                <td>{coin.rank}</td>
                <td>{coin.name} ({coin.symbol})</td>
                <td>${coin.price.toFixed(2)}</td>
                <td>{formatCompactUSD(coin.market_cap)}</td>
                <td>{formatCompactUSD(coin.volume)}</td>
                <td className={coin.percent_change_1d >= 0 ? 'text-success' : 'text-danger'}>
                  {coin.percent_change_1d?.toFixed(2)}%
                </td>
                <td className={coin.percent_change_7d >= 0 ? 'text-success' : 'text-danger'}>
                  {coin.percent_change_7d?.toFixed(2)}%
                </td>
                <td className={coin.percent_change_30d >= 0 ? 'text-success' : 'text-danger'}>
                  {coin.percent_change_30d?.toFixed(2)}%
                </td>
                <td className={coin.percent_change_90d >= 0 ? 'text-success' : 'text-danger'}>
                  {coin.percent_change_90d?.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
