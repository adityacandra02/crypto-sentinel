// backend/storeNewsToSupabase.js
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const cryptoPanicKey = process.env.CRYPTOPANIC_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials (URL or KEY) are missing. Check environment variables.');
}

if (!cryptoPanicKey) {
  throw new Error('CryptoPanic API Key missing.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const watchlist = [
  'ONDO', 'SUI', 'ENA', 'ALGO', 'WLD', 'JTO',
  'TAO', 'REZ', 'LINK', 'ICP', 'ALT', 'FET'
];

exports.handler = async function () {
  try {
    for (const symbol of watchlist) {
      const res = await fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=${cryptoPanicKey}&currencies=${symbol}&kind=news&public=true`);
      const json = await res.json();

      if (!json.results || !Array.isArray(json.results)) {
        console.warn(`[WARNING] Invalid or empty CryptoPanic response for ${symbol}`);
        continue;
      }

      for (const item of json.results) {
        const cryptopanic_news_id = item.id;
        const created_at = item.published_at || item.created_at;
        const title = item.title || 'Untitled';

        // Check if this news already exists
        const { data: existing, error: checkError } = await supabase
          .from('coin_news')
          .select('id')
          .eq('cryptopanic_news_id', cryptopanic_news_id)
          .maybeSingle();

        if (checkError) {
          console.error(`[Supabase Select Error]`, checkError);
          continue;
        }

        if (existing) {
          // News already exists, skip
          continue;
        }

        // Insert into Supabase
        const { error: insertError } = await supabase
          .from('coin_news')
          .insert([{
            cryptopanic_news_id,
            coin: symbol,
            title,
            created_at,
          }]);

        if (insertError) {
          console.error(`[Supabase Insert Error]`, insertError);
        }
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
