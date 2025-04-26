// backend/summarizeNewsDaily.js
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async function () {
  const today = new Date().toISOString().split('T')[0];

  try {
    // Step 1: Fetch today's news from 'coin_news' table
    const { data: newsData, error } = await supabase
      .from('coin_news')
      .select('coin, title')
      .gte('created_at', `${today}T00:00:00Z`)
      .lte('created_at', `${today}T23:59:59Z`);

    if (error) throw error;
    if (!newsData || newsData.length === 0) {
      console.warn('[Daily Summary Warning] No news available for today.');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No news available to summarize.' }),
      };
    }

    // Step 2: Group news by coin
    const grouped = newsData.reduce((acc, item) => {
      acc[item.coin] = acc[item.coin] || [];
      acc[item.coin].push(item.title);
      return acc;
    }, {});

    // Step 3: Summarize per coin using GPT-4
    for (const [coin, titles] of Object.entries(grouped)) {
      const prompt = `
You are a professional crypto analyst.

Summarize the key news themes, investor sentiment, and potential impact on price for **${coin}** based on today's headlines:

${titles.map(t => `- ${t}`).join('\n')}

Summary instructions:
- Be concise (around 3-5 sentences).
- Mention overall market tone if obvious (bullish, bearish, neutral).
- Highlight important events (e.g., partnerships, regulations, hacks).

Only provide the clear analysis text. No title or header needed.
      `.trim();

      const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4',  // ✅ now using GPT-4
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5
      });

      const summary = gptResponse.choices[0]?.message?.content?.trim() || 'No summary generated.';

      // Step 4: Upsert into 'daily_summaries' table
      await supabase
        .from('daily_summaries')
        .upsert(
          [{ coin_symbol: coin, summary, date: today }],
          { onConflict: ['coin_symbol', 'date'] }
        );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Daily summaries generated successfully.' }),
    };
  } catch (err) {
    console.error('[Daily Summary Error]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to summarize daily news', details: err.message }),
    };
  }
};
