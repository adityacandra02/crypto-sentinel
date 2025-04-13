// backend/analyzeWithLLMWatchlist.js
const { OpenAI } = require('openai');
const fetch = require('node-fetch');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const coins = Array.isArray(body.coins) ? body.coins : [];
    const model = body.model || 'gpt-3.5-turbo';

    if (!coins.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No coins data provided.' }),
      };
    }

    const newsResponse = await fetch(`${process.env.URL}/.netlify/functions/fetchNewsSentiment`);
    const newsData = await newsResponse.json();
    const sentiments = Array.isArray(newsData.sentiments) ? newsData.sentiments : [];

    const prompt = `
You are a professional crypto market analyst.

Evaluate the following WATCHLIST coins based on their recent sentiment from top crypto news headlines (summarized below). Your analysis should:

- Focus only on news-driven insights and public sentiment (ignore raw numbers like price or market cap).
- Classify each coin into HOLD, SELL, or WATCH categories.
- Justify your classification with sentiment-based reasoning.
- Be concise but informative, using markdown headers and bullet points.

COIN MARKET DATA:
${coins.map((c, i) => {
  return `${i + 1}. ${c.name} (${c.symbol}) - Price: $${c.price?.toFixed(2)}, Market Cap: ${Math.round(c.market_cap)}, 1d: ${c.percent_change_1d?.toFixed(2)}%, 7d: ${c.percent_change_7d?.toFixed(2)}%`
}).join('\n')}

COIN SENTIMENTS:
${sentiments.map(s => `- ${s.coin}: ${s.summary}`).join('\n')}

Respond only with insights in markdown.
`;

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });

    const aiInsight = response.choices?.[0]?.message?.content || '';

    return {
      statusCode: 200,
      body: JSON.stringify({ insight: aiInsight }),
    };

  } catch (err) {
    console.error('[LLM Watchlist ERROR]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to analyze insight' }),
    };
  }
};
