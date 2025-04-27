// backend/summarizeNewsDaily.js
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Service Role Key (Admin)

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Key is missing. Check your Netlify environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async function () {
  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  try {
    // Step 1: Fetch today's news
    const { data: newsData, error: fetchError } = await supabase
      .from('coin_news')
      .select('coin, title')
      .gte('created_at', `${today}T00:00:00Z`)
      .lte('created_at', `${today}T23:59:59Z`);

    if (fetchError || !newsData || newsData.length === 0) {
      throw new Error(fetchError?.message || 'No news found for today.');
    }

    // Step 2: Group news by coin
    const grouped = newsData.reduce((acc, { coin, title }) => {
      acc[coin] = acc[coin] || [];
      acc[coin].push(title);
      return acc;
    }, {});

    // Step 3: Summarize for each coin
    for (const [coin, titles] of Object.entries(grouped)) {
      const prompt = `
Summarize today's crypto news headlines for **${coin}**.

Headlines:
${titles.map(title => `- ${title}`).join('\n')}

Summarize sentiment, key themes, and potential impact (max 150 words).
`.trim();

      const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      });

      const summary = gptResponse.choices[0]?.message?.content?.trim() || 'No summary generated.';

      // Step 4: Upsert into daily_summaries table
      await supabase
        .from('daily_summaries')
        .upsert(
          [{ coin, summary, date: today }],
          { onConflict: ['coin', 'date'] } // Avoid duplicate inserts
        );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Daily news summarized successfully.' }),
    };
  } catch (error) {
    console.error('[Summarize News Daily ERROR]', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Unknown error' }),
    };
  }
};
