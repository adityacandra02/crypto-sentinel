const fetch = require('node-fetch');
require('dotenv').config();

module.exports = async function fetchTopCoins(limit = 10) {
  const apiKey = process.env.CMC_API_KEY;
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${limit}&convert=USD`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
    });

    const json = await response.json();
    return json.data.map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.quote.USD.price,
      market_cap: coin.quote.USD.market_cap,
      volume: coin.quote.USD.volume_24h,
      percent_change_1d: coin.quote.USD.percent_change_24h,
      percent_change_30d: coin.quote.USD.percent_change_30d,
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
