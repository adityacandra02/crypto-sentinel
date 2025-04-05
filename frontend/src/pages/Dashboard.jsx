import React, { useEffect, useState } from 'react';
import { getMarketData } from '../services/api';

const Dashboard = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    getMarketData().then(setCoins);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>🚀 Crypto Market Overview</h1>
      {coins.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price (USD)</th>
              <th>Market Cap</th>
              <th>24h Volume</th>
              <th>7d Change (%)</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.id}>
                <td>{coin.name} ({coin.symbol.toUpperCase()})</td>
                <td>${coin.price.toFixed(2)}</td>
                <td>${coin.market_cap.toLocaleString()}</td>
                <td>${coin.volume.toLocaleString()}</td>
                <td>{coin.percent_change_7d?.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
