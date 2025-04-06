const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { coins } = JSON.parse(event.body);

    if (!coins || coins.length === 0) {
      console.error('[LLM] No coins received.');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No coin data received' })
      };
    }

    console.log('[LLM] Received top coins:', coins.slice(0, 3));

    const topCoins = coins
      .slice(0, 10)
      .map((coin, i) =>
        `${i + 1}. ${coin.name} (${coin.symbol}) - $${coin.price.toFixed(2)} - 7d: ${coin.percent_change_7d?.toFixed(2)}%`
      )
      .join('\n');

    const prompt = `
You're a crypto analyst. Based on the data below, provide:
- Which coins look strong for long-term holding and why
- Any patterns or concerns
- Market summary (max 150 words)

Top Coins:
${topCoins}
`;

    const model = 'gpt-4-turbo'; // ✅ or use 'gpt-3.5-turbo' for free

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error('[LLM] OpenAI HTTP error:', response.status, await response.text());
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `OpenAI API failed with status ${response.status}` })
      };
    }

    const json = await response.json();

    if (!json.choices || !json.choices[0]?.message?.content) {
      console.error('[LLM] No choices/content in response:', JSON.stringify(json, null, 2));
      throw new Error('No response from LLM');
    }

    const message = json.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ insight: message })
    };

  } catch (err) {
    console.error('LLM Analysis Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate insights',
        detail: err.message
      })
    };
  }
};
