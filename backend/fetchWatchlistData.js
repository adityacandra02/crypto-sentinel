// backend/fetchWatchlistData.js
const fetch = require('node-fetch');

const watchlistSymbols = [
  'ONDO', 'SUI', 'ENA', 'ALGO', 'WLD', 'JTO',
  'TAO', 'REZ', 'LINK', 'ICP', 'ALT', 'FET'
];

exports.handler = async function () {
  const CMC_API_KEY = process.env.CMC_API_KEY;

  try {
    const res = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=500&convert=USD`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY
        }
      }
    );

    const json = await res.json();
    const filteredCoins = json.data.filter(coin => watchlistSymbols.includes(coin.symbol));
    
    const simplified = filteredCoins.map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      volume: coin.quote.USD.volume_24h,
      percent_change_1d: coin.quote.USD.percent_change_24h,
      percent_change_7d: coin.quote.USD.percent_change_7d,
      percent_change_30d: coin.quote.USD.percent_change_30d,
      percent_change_90d: coin.quote.USD.percent_change_90d
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(simplified)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
