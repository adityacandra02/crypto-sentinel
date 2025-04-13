const fetch = require('node-fetch');

const watchlistCoins = [
  { name: 'Ondo', symbol: 'ONDO' },
  { name: 'Sui', symbol: 'SUI' },
  { name: 'Ethena', symbol: 'ENA' },
  { name: 'Algorand', symbol: 'ALGO' },
  { name: 'Worldcoin', symbol: 'WLD' },
  { name: 'Jito', symbol: 'JTO' },
  { name: 'Bittensor', symbol: 'TAO' },
  { name: 'Renzo', symbol: 'REZ' },
  { name: 'Chainlink', symbol: 'LINK' },
  { name: 'Internet Computer', symbol: 'ICP' },
  { name: 'Altlayer', symbol: 'ALT' },
  { name: 'Artificial Superintelligence Alliance', symbol: 'FET' },
];

exports.handler = async function () {
  const API_KEY = process.env.CRYPTO_PANIC_API_KEY;

  if (!API_KEY) {
    console.error('[CryptoPanic ERROR] Missing API key');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing CryptoPanic API key' }),
    };
  }

  const sentiments = [];

  try {
    for (const coin of watchlistCoins) {
      const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${API_KEY}&currencies=${coin.symbol}&kind=news&public=true`;

      const response = await fetch(url);
      const json = await response.json();

      if (!json || !json.results) {
        console.warn(`[CryptoPanic WARNING] No results for ${coin.symbol}`);
        continue;
      }

      const summaries = json.results.slice(0, 3).map(post => `• ${post.title}`).join('\n');
      sentiments.push({
        coin: coin.name,
        summary: summaries || 'No significant news.',
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ sentiments }),
    };
  } catch (err) {
    console.error('[CryptoPanic ERROR]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
