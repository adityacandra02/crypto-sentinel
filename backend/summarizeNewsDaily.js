// backend/summarizeNewsDaily.js
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');

// ❗ FIX: Use SUPABASE_KEY instead of SERVICE_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async function () {
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data: newsData, error } = await supabase
      .from('coin_news')
      .select('coin, title')  // ⚡ also fix: your table is using "coin", not "coin_symbol"
      .gte('created_at', `${today}T00:00:00Z`)
      .lte('created_at', `${today}T23:59:59Z`);

    if (error) throw error;

    const grouped = newsData.reduce((acc, item) => {
      acc[item.coin] = acc[item.coin] || [];
      acc[item.coin].push(item.title);
      return acc;
    }, {});

    for (const [coin, titles] of Object.entries(grouped)) {
      const prompt = `
Summarize the following crypto news headlines for ${coin} today:

${titles.map(t => `- ${t}`).join('\n')}

Provide a 3-5 sentence overview highlighting major themes or sentiment.
      `.trim();

      const gpt = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4
      });

      const summary = gpt.choices[0]?.message?.content || 'No summary generated.';

      await supabase
        .from('daily_summaries')
        .upsert([
          { coin_symbol: coin, summary, date: today }
        ], {
          onConflict: ['coin_symbol', 'date']
        });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Summaries stored successfully' })
    };
  } catch (err) {
    console.error('[Daily Summary Error]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to summarize news' })
    };
  }
};
