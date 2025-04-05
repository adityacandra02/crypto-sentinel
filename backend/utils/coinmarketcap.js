const fetch = require('node-fetch'); 
module.exports = async function fetchTopCoins(limit = 10) { 
 
  const apiKey = process.env.CMC_API_KEY; 
 
  try { 
    const response = await fetch(url, { 
      headers: { 
        'X-CMC_PRO_API_KEY': apiKey, 
        'Accept': 'application/json' 
      } 
    }); 
 
    if (!response.ok) throw new Error(`API error: ${response.status}`); 
    const json = await response.json(); 
    return json.data.map(coin =
      id: coin.id, name: coin.name, symbol: coin.symbol, 
      price: coin.quote.USD.price, market_cap: coin.quote.USD.market_cap, 
      volume: coin.quote.USD.volume_24h, percent_change_7d: coin.quote.USD.percent_change_7d 
    })); 
  } catch (error) { 
    console.error(\"Error:\", error); 
    return []; 
  } 
}; 
