// backend/analyzeWithLLMWatchlist.js
const { OpenAI } = require('openai');
const fetch = require('node-fetch');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const coins = body.coins || [];
    const model = body.model || 'gpt-3.5-turbo';

    const newsResponse = await fetch(`${process.env.URL}/.netlify/functions/fetchNewsSentiment`);
    const newsData = await newsResponse.json();

    const prompt = `
You are a professional crypto market analyst.

Evaluate the following WATCHLIST coin data and news sentiment. Analyze:
- Current market values (price, % changes, market cap)
- Sentiment headlines (summarized below per coin)
Exclude stablecoins.

Respond with clear recommendations in these sections:
HOLD, SELL, WATCH.

Format it for clarity. Use markdown bullet points.

COIN MARKET DATA:
${coins.map((c, i) => `${i + 1}. ${c.name} (${c.symbol}) - Price: $${c.price.toFixed(2)}, Market Cap: ${Math.round(c.market_cap)}, 1d: ${c.percent_change_1d?.toFixed(2)}%, 7d: ${c.percent_change_7d?.toFixed(2)}%`).join('\n')}

COIN SENTIMENTS:
${newsData.sentiments.map(item => `- ${item.coin}: ${item.summary}`).join('\n')}

Only respond with insight text.
`;

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });

    const aiInsight = response.choices[0]?.message?.content || '';
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
