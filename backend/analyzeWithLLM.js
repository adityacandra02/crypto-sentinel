const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
  try {
    const { coins, model } = JSON.parse(event.body);
    const selectedModel = model || 'gpt-3.5-turbo';

    const topCoins = coins
      .slice(0, 25)
      .map((coin, i) => {
        return `${i + 1}. ${coin.name} (${coin.symbol}) - Price: $${coin.price.toFixed(2)}, Market Cap: $${(
          coin.market_cap / 1e9
        ).toFixed(2)}B, 1d: ${coin.percent_change_1d?.toFixed(2)}%, 7d: ${coin.percent_change_7d?.toFixed(
          2
        )}%, 30d: ${coin.percent_change_30d?.toFixed(2)}%, 90d: ${coin.percent_change_90d?.toFixed(2)}%`;
      })
      .join('\n');

    const prompt = `You are a professional crypto market analyst.

Analyze the following TOP 25 coin data, considering:
- Current market values (price, market cap, % change)
- Overall market sentiment (especially in the US)
- Recent major news headlines from top crypto sources like CoinDesk, CoinTelegraph, Decrypt

For each section (HOLD, SELL, WATCH), group coins accordingly and explain why.

COIN DATA:
${topCoins}

Only include meaningful insights. Write in clear sections: HOLD, SELL, WATCH.`;

    const response = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        { role: 'system', content: 'You are a helpful crypto analyst.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = response.choices[0]?.message?.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ insight: result }),
    };
  } catch (error) {
    console.error('[LLM] OpenAI Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'LLM Analysis Error: ' + error.message }),
    };
  }
};
