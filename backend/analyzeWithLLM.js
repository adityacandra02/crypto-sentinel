const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { coins } = JSON.parse(event.body);

    const topCoins = coins
      .slice(0, 10)
      .map((coin, i) =>
        `${i + 1}. ${coin.name} (${coin.symbol}) - $${coin.price.toFixed(2)} - 7d: ${coin.percent_change_7d?.toFixed(2)}%`
      )
      .join('\n');

    const prompt = `
You are an expert crypto analyst. Analyze the following top coins and provide:

1. Coins that are good for long-term holding and why
2. Observations about weekly performance
3. Short summary under 150 words

Top Coins:
${topCoins}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview', // GPT-4 mini (faster, cheaper)
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const json = await response.json();

    if (!json.choices || !json.choices[0]) {
      throw new Error('No response from LLM');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ insight: json.choices[0].message.content })
    };
  } catch (err) {
    console.error('LLM Analysis Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate insights' })
    };
  }
};
