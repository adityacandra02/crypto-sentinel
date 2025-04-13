// backend/summarizeDailyNews.js
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

exports.handler = async () => {
  const today = new Date().toISOString().split('T')[0];

  try {
    // Step 1: Fetch today's news per coin
    const { data: allNews, error: fetchErr } = await supabase
      .from('coin_news')
      .select('coin, title')
      .eq('date', today);

    if (fetchErr || !allNews) throw new Error(fetchErr?.message || 'No news found');

    // Step 2: Group by coin
    const grouped = allNews.reduce((acc, { coin, title }) => {
      acc[coin] = acc[coin] || [];
      acc[coin].push(title);
      return acc;
    }, {});

    // Step 3: Summarize each coin
    for (const [coin, titles] of Object.entries(grouped)) {
      const prompt = `Summarize the sentiment and key themes of the following crypto news titles for ${coin} (max 200 words):\n\n${titles.map(t => `- ${t}`).join('\n')}`;
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }]
      });
      const summary = completion.choices[0]?.message?.content?.trim();

      // Step 4: Store summary in Supabase
      await supabase
        .from('coin_summaries')
        .upsert({
          coin,
          date: today,
          summary
        }, { onConflict: ['coin', 'date'] });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Summaries updated.' })
    };
  } catch (err) {
    console.error('[Daily Summary ERROR]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to summarize news' })
    };
  }
};
