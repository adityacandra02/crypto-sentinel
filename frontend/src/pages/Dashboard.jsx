import React, { useEffect, useState } from 'react';
import { getMarketData } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    getMarketData().then((data) => {
      setCoins(data);
      setLoading(false);
    });
  }, []);

  const sortData = (key) => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    const sorted = [...coins].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      return order === 'asc' ? valA - valB : valB - valA;
    });
    setCoins(sorted);
    setSortKey(key);
    setSortOrder(order);
  };

  const formatMillions = (num) => {
    if (!num) return '-';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    return `$${(num / 1e6).toFixed(2)}M`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📊 Crypto Dashboard</h1>
        <button
          onClick={() => navigate('/insights')}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm"
        >
          🧠 Go to AI Insights
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Price</th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => sortData('market_cap')}
                >
                  Market Cap {sortKey === 'market_cap' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => sortData('volume')}
                >
                  24h Volume {sortKey === 'volume' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => sortData('percent_change_1d')}
                >
                  1d % {sortKey === 'percent_change_1d' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => sortData('percent_change_7d')}
                >
                  7d % {sortKey === 'percent_change_7d' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => sortData('percent_change_30d')}
                >
                  30d % {sortKey === 'percent_change_30d' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => sortData('percent_change_90d')}
                >
                  90d % {sortKey === 'percent_change_90d' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, index) => (
                <tr key={coin.id} className="border-b border-gray-700">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{coin.name} ({coin.symbol})</td>
                  <td className="px-4 py-2">${coin.price.toFixed(2)}</td>
                  <td className="px-4 py-2">{formatMillions(coin.market_cap)}</td>
                  <td className="px-4 py-2">{formatMillions(coin.volume)}</td>
                  <td className={`px-4 py-2 ${coin.percent_change_1d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.percent_change_1d?.toFixed(2)}%
                  </td>
                  <td className={`px-4 py-2 ${coin.percent_change_7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.percent_change_7d?.toFixed(2)}%
                  </td>
                  <td className={`px-4 py-2 ${coin.percent_change_30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.percent_change_30d?.toFixed(2)}%
                  </td>
                  <td className={`px-4 py-2 ${coin.percent_change_90d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.percent_change_90d?.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
