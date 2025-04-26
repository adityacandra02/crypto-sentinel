// backend/summarizeNewsDaily.js
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');

// Initialize Supabase and OpenAI
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async function () {
  const today = new Date().toISOString().split('T')[0]; // e.g., '2025-04-26'

  try {
    // Step 1: Fetch today's news from coin_news table
    const { data: newsData, error: fetchError } = await supabase
      .from('coin_news')
      .select('coin, title')
      .like('created_at', `${today}%`);

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    if (!newsData || newsData.length === 0) {
      throw new Error('No news found for today.');
    }

    // Step 2: Group news titles by coin
    const groupedNews = newsData.reduce((acc, item) => {
      acc[item.coin] = acc[item.coin] || [];
      acc[item.coin].push(item.title);
      return acc;
    }, {});

    // Step 3: For each coin, summarize today's news using GPT-4
    for (const [coin, titles] of Object.entries(groupedNews)) {
      const prompt = `
Summarize the following news headlines for the cryptocurrency **${coin}** from today's date (${today}):

${titles.map(title => `- ${title}`).join('\n')}

Provide a clear, 3-5 sentence summary focusing on investor sentiment, important news themes, and any major price triggers.
Use neutral, professional tone.
      `.trim();

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      });

      const summary = completion.choices[0]?.message?.content?.trim() || 'No summary generated.';

      // Step 4: Store the summarized result into daily_summaries table
      const { error: upsertError } = await supabase
        .from('daily_summaries')
        .upsert([
          {
            coin_symbol: coin,
            date: today,
            summary: summary
          }
        ], {
          on_conflict: ['coin_symbol', 'date'] // Corrected!
        });

      if (upsertError) {
        console.error(`[Summarize Error] Failed to upsert summary for ${coin}`, upsertError);
      }
    }

    // Step 5: Return success
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Summaries generated and stored successfully.' })
    };
  } catch (err) {
    console.error('[SummarizeNewsDaily ERROR]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error occurred during summarization.' })
    };
  }
};
