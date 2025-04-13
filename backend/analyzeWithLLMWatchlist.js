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

    if (!newsData || !Array.isArray(newsData.sentiments)) {
      throw new Error('Sentiment data is invalid or missing');
    }

    // Create a lookup for faster access
    const sentimentMap = {};
    newsData.sentiments.forEach(item => {
      sentimentMap[item.coin.toUpperCase()] = item.summary;
    });

    // Merge coin list and sentiment
    const sentimentLines = coins.map((coin, i) => {
      const summary = sentimentMap[coin.symbol.toUpperCase()] || 'No recent news or sentiment available.';
      return `- ${coin.name} (${coin.symbol}): ${summary}`;
    }).join('\n');

    const prompt = `
You are a professional crypto analyst.

Analyze **only the news sentiment** for each of the following watchlist coins.
Do NOT use or show market data.

Based on the recent news (if any), classify each coin into one of the following:

- ✅ HOLD — strong positive sentiment
- ❌ SELL — negative or bearish signals
- 👀 WATCH — neutral or mixed outlook, worth monitoring

News Sentiment Summary:
${sentimentLines}

Respond in this markdown format:

## HOLD
- **Coin (Symbol)**  
  - *Reasoning*

## SELL
...

## WATCH
...
`;

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });

    const aiInsight = response.choices[0]?.message?.content || 'No insight generated.';
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
