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

    const prompt = `
You are a professional crypto analyst.

Analyze the **CryptoPanic news sentiment** for the following watchlist coins and classify them into these three sections:
- ✅ HOLD: Strong news or ongoing value drivers, best to keep.
- ❌ SELL: Negative or uncertain outlook, recommend selling.
- 👀 WATCH: News is emerging or uncertain, monitor for now.

Only use sentiment-driven reasoning. **Do not repeat raw price or market cap data**. Focus instead on:
- Recurring topics in the news
- Positive/negative tone
- Relevance of the news to the coin's future outlook

Present the result in markdown with **bullet points grouped by section**.
Use this structure:

## HOLD
- **CoinName (Symbol)**  
  - *Rationale based on sentiment*

## SELL
...

## WATCH
...

Coin Sentiment Summary:
${newsData.sentiments.map(item => `- ${item.coin}: ${item.summary}`).join('\n')}
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
