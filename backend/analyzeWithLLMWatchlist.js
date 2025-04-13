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

    // ✅ Defensive logging
    console.log('[News Data]', JSON.stringify(newsData, null, 2));

    if (!newsData || !Array.isArray(newsData.sentiments)) {
      console.warn('[LLM Watchlist WARNING] Sentiment format unexpected, using fallback');
    }

    const sentimentLines = Array.isArray(newsData.sentiments)
      ? newsData.sentiments.map(item => `- ${item.coin}: ${item.summary}`).join('\n')
      : 'No sentiment data available.';

    const prompt = `
You are a professional crypto analyst.

Analyze **news sentiment only** for the following coins.
Do NOT include raw market data in the output.

Classify coins into:
- ✅ HOLD
- ❌ SELL
- 👀 WATCH

Base your decision on the summarized CryptoPanic headlines:
${sentimentLines}

Respond in markdown using this format:

## HOLD
- **Coin (Symbol)**  
  - *Brief reasoning based on sentiment*

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
