const fetch = require('node-fetch');

const CRYPTOPANIC_API_KEY = process.env.CRYPTOPANIC_API_KEY;

const watchlistKeywords = [
  'Ondo', 'Sui', 'Ethena', 'Algorand', 'Worldcoin', 'Jito',
  'Bittensor', 'Renzo', 'Chainlink', 'Internet Computer',
  'Altlayer', 'Artificial Superintelligence Alliance'
];

exports.handler = async function () {
  try {
    const results = {};

    for (const keyword of watchlistKeywords) {
      const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${CRYPTOPANIC_API_KEY}&currencies=${keyword}&kind=news&public=true`;

      const res = await fetch(url);
      const data = await res.json();

      results[keyword] = {
        sentiment_summary: {
          positive: 0,
          negative: 0,
          neutral: 0
        },
        articles: []
      };

      data.results.forEach((article) => {
        const sentiment = article.votes && article.votes.positive
          ? 'positive'
          : article.votes && article.votes.negative
          ? 'negative'
          : 'neutral';

        results[keyword].sentiment_summary[sentiment] += 1;
        results[keyword].articles.push({
          title: article.title,
          url: article.url,
          published_at: article.published_at,
          sentiment
        });
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (err) {
    console.error('[CryptoPanic ERROR]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
