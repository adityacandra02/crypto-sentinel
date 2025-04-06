const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const coins = body.coins || [];
    const model = body.model || "gpt-3.5-turbo";

    const topCoins = coins
      .slice(0, 25)
      .map((coin, index) => {
        return `${index + 1}. ${coin.name} (${coin.symbol}) - Price: $${coin.price.toFixed(2)}, Market Cap: $${Math.round(coin.market_cap)}, 1d: ${coin.percent_change_1d?.toFixed(2)}%, 7d: ${coin.percent_change_7d?.toFixed(2)}%, 30d: ${coin.percent_change_30d?.toFixed(2)}%, 90d: ${coin.percent_change_90d?.toFixed(2)}%`;
      })
      .join("\n");

      const prompt = `You are a professional crypto market analyst.

      Analyze the following TOP 25 coin data, excluding stablecoins (e.g., USDT, USDC, DAI, BUSD), and considering:
      - Current market values (price, market cap, % change)
      - Overall market sentiment (especially in the US)
      - Recent major news headlines from top crypto sources like CoinDesk, CoinTelegraph, Decrypt
      
      Group the remaining assets into three sections: HOLD, SELL, WATCH.
      For each coin listed, explain briefly why it belongs in that category.
      
      COIN DATA:
      ${topCoins}
      
      Only include meaningful insights. Write in clear sections: HOLD, SELL, WATCH.`;
      

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a financial analyst who specializes in crypto market reports."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    });

    const insight = completion?.choices?.[0]?.message?.content?.trim();

    if (!insight) {
      console.warn("[LLM WARNING] No insight content returned.");
      return {
        statusCode: 200,
        body: JSON.stringify({ insight: "No insight received." })
      };
    }

    console.log("[LLM] Insight generated successfully.");
    return {
      statusCode: 200,
      body: JSON.stringify({ insight })
    };
  } catch (error) {
    console.error("[LLM ERROR]", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ insight: "Error generating insight." })
    };
  }
};
