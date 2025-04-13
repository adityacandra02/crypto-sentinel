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
      .select('coin_symbol, title')
      .gte('created_at', `${today}T00:00:00Z`)
      .lte('created_at', `${today}T23:59:59Z`);

    if (error) throw error;

    const grouped = newsData.reduce((acc, item) => {
      acc[item.coin_symbol] = acc[item.coin_symbol] || [];
      acc[item.coin_symbol].push(item.title);
      return acc;
    }, {});

    for (const [coin, titles] of Object.entries(grouped)) {
      const prompt = `
Summarize the following headlines for ${coin} from today's crypto news:

${titles.map(t => `- ${t}`).join('\n')}

Respond with a 3-5 sentence summary about investor sentiment, news themes, or price movement triggers.
      `.trim();

      const gpt = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
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
