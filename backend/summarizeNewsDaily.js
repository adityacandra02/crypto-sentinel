// backend/summarizeNewsDaily.js
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async function () {
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data: newsData, error } = await supabase
      .from('coin_news')
      .select('coin, title')  // <-- fix this to 'coin' not 'coin_symbol'
      .gte('created_at', `${today}T00:00:00Z`)
      .lte('created_at', `${today}T23:59:59Z`);

    if (error || !newsData) throw new Error(error?.message || 'No news data');

    const grouped = newsData.reduce((acc, item) => {
      acc[item.coin] = acc[item.coin] || [];
      acc[item.coin].push(item.title);
      return acc;
    }, {});

    for (const [coin, titles] of Object.entries(grouped)) {
      const prompt = `
Summarize today's news for ${coin}. Focus on overall investor sentiment, big price movement triggers, and any important project updates.

Headlines:
${titles.map(t => `- ${t}`).join('\n')}

Respond in 3-5 concise sentences.
`.trim();

      const gpt = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
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
      body: JSON.stringify({ message: 'Daily summaries created successfully.' }),
    };
  } catch (err) {
    console.error('[Summarize News Daily ERROR]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error during summarizing' }),
    };
  }
};
