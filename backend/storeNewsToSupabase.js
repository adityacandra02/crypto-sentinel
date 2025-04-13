const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Schedule to run hourly
exports.handler = async function (event, context) {
  console.log(`[CRON] Fetching news at ${new Date().toISOString()}`);

  const watchlist = [
    'ONDO', 'SUI', 'ENA', 'ALGO', 'WLD', 'JTO',
    'TAO', 'REZ', 'LINK', 'ICP', 'ALT', 'FET'
  ];

  const token = process.env.CRYPTOPANIC_API_KEY;
  const allNews = [];

  for (const symbol of watchlist) {
    try {
      const res = await fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=${token}&currencies=${symbol}&kind=news&public=true`);
      const json = await res.json();
      const newsItems = json.results || [];

      for (const item of newsItems) {
        const newsId = item.id;
        const title = item.title;
        const published_at = item.published_at;
        const created_at = item.created_at;

        allNews.push({
          cryptopanic_news_id: newsId,
          coin: symbol,
          title,
          published_at,
          created_at
        });
      }
    } catch (err) {
      console.error(`[ERROR] Failed fetching for ${symbol}:`, err.message);
    }

    await new Promise((r) => setTimeout(r, 300)); // ~3 requests/sec
  }

  // Prevent duplicates based on cryptopanic_news_id
  for (const news of allNews) {
    const { data, error } = await supabase
      .from('coin_news')
      .select('id')
      .eq('cryptopanic_news_id', news.cryptopanic_news_id)
      .maybeSingle();

    if (!data && !error) {
      const { error: insertError } = await supabase
        .from('coin_news')
        .insert([news]);

      if (insertError) {
        console.error('[Insert Error]', insertError.message);
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hourly CryptoPanic news updated successfully.' }),
  };
};

exports.handler.schedule = '@hourly';
