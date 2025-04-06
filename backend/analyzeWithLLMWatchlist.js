const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event, context) {
  try {
    const body = JSON.parse(event.body);
    const coins = body.coins || [];
    const model = body.model || "gpt-3.5-turbo";

    const stableCoins = ['USDT', 'USDC', 'DAI', 'TUSD', 'BUSD'];
    const filteredCoins = coins.filter((coin) => !stableCoins.includes(coin.symbol?.toUpperCase()));

    const formatted = filteredCoins.map((coin, i) => {
      return `${i + 1}. ${coin.name} (${coin.symbol})\n` +
        `Price: $${coin.price?.toFixed(2)} | Market Cap: $${Math.round(coin.market_cap)}\n` +
        `1d: ${coin.percent_change_1d}% | 7d: ${coin.percent_change_7d}% | 30d: ${coin.percent_change_30d}% | 90d: ${coin.percent_change_90d}%\n`;
    }).join('\n');

    const prompt = `You are a crypto analyst. Analyze the following WATCHLIST coins.

Consider:
- Market values: price, market cap, % changes
- US market sentiment
- Latest crypto news from CoinDesk, CoinTelegraph, etc.

Provide recommendation for each coin (HOLD / SELL / WATCH) and explain briefly.

WATCHLIST COINS:\n\n${formatted}`;

    const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));
    const completion = await openai.createChatCompletion({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const reply = completion?.data?.choices?.[0]?.message?.content || '';
    return {
      statusCode: 200,
      body: JSON.stringify({ insight: reply })
    };

  } catch (err) {
    console.error("[LLM Watchlist ERROR]", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ insight: "Error generating insights." })
    };
  }
};
