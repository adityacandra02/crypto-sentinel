// backend/storeNewsToSupabase.js
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials (URL or KEY) are missing. Check environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const watchlist = [
  'ONDO', 'SUI', 'ENA', 'ALGO', 'WLD', 'JTO',
  'TAO', 'REZ', 'LINK', 'ICP', 'ALT', 'FET'
];

exports.handler = async () => {
  try {
    for (const symbol of watchlist) {
      const res = await fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=${process.env.CRYPTOPANIC_API_KEY}&currencies=${symbol}&kind=news&public=true`);
      const json = await res.json();

      if (!json.results || !Array.isArray(json.results)) {
        console.warn(`[WARNING] Invalid result format for symbol: ${symbol}`);
        continue;
      }

      for (const item of json.results) {
        const cryptopanic_news_id = item.id;
        const existing = await supabase
          .from('coin_news')
          .select('id')
          .eq('cryptopanic_news_id', cryptopanic_news_id)
          .maybeSingle();

        if (existing.data) {
          continue; // Skip if already exists
        }

        const created_at = item.published_at || item.created_at;
        const title = item.title || 'Untitled';

        await supabase.from('coin_news').insert([{
          cryptopanic_news_id,
          coin: symbol,
          title,
          created_at,
        }]);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'News stored to Supabase successfully.' }),
    };
  } catch (err) {
    console.error('[storeNewsToSupabase ERROR]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error' }),
    };
  }
};
