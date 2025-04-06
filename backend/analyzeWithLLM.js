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

      Your task is to analyze the following TOP 25 cryptocurrencies using the following perspectives:
      1. **Current Market Metrics** – Evaluate price, market capitalization, and recent percentage changes (1D, 7D, 30D, 90D).
      2. **Market Sentiment** – Consider global sentiment with a focus on the United States (e.g., investor fear/greed, regulatory trends, macroeconomic signals).
      3. **Recent Crypto News** – Reflect any major headlines or narratives (from sources like CoinDesk, CoinTelegraph, Decrypt).
      
      **Your output should be grouped into the following categories:**
      - **HOLD**: Coins with strong fundamentals and stability.
      - **SELL**: Coins that show signs of weakness or risk.
      - **WATCH**: Coins that have potential but need close observation.
      
      For each group:
      - List the coin symbols or names.
      - Give a concise explanation why the coin fits in that group.
      - Highlight any relevant news or metrics that influence your judgment.
      
      ### COIN DATA:
      ${topCoins}
      
      Make sure the output is formatted in markdown for readability, using bullet points and section headers (e.g., ### HOLD). Only include useful insights, avoid repetition.`;

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
