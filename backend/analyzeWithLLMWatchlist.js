// backend/analyzeWithLLMWatchlist.js
const { OpenAI } = require('openai');

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const filteredCoins = body.filteredCoins || [];
    const model = body.model || 'gpt-3.5-turbo';

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
You are a professional crypto market analyst.

Analyze the following watchlist coins, considering:
- Current market values (price, market cap, % change)
- Overall market sentiment (especially in the US)
- Recent major news headlines from crypto sources (e.g., CoinDesk, CoinTelegraph, Decrypt)

Ignore stablecoins. Group them into: HOLD, SELL, WATCH — and explain why.

COIN DATA:
${JSON.stringify(filteredCoins, null, 2)}

Only include meaningful insights. Write in clear sections: HOLD, SELL, WATCH.
`;

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const insight = completion.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ insight })
    };
  } catch (err) {
    console.error('[LLM Watchlist ERROR]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate insight.' })
    };
  }
};
