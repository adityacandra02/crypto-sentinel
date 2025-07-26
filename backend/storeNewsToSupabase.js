// backend/storeNewsToSupabase.js
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
// Align environment variable name with other functions
// e.g. fetchNewsSentiment.js expects CRYPTO_PANIC_API_KEY
const cryptoPanicKey = process.env.CRYPTO_PANIC_API_KEY;

if (!supabaseUrl || !supabaseKey || !cryptoPanicKey) {
  throw new Error('Supabase or CryptoPanic credentials missing.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const watchlist = [
  'ONDO', 'SUI', 'ENA', 'ALGO', 'WLD', 'JTO',
  'TAO', 'REZ', 'LINK', 'ICP', 'ALT', 'FET'
];

// Helper to wait
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.handler = async () => {
  const logs = []; // For returning to frontend
  try {
    for (const symbol of watchlist) {
      console.log(`Fetching for ${symbol}...`);
      const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${cryptoPanicKey}&currencies=${symbol}&kind=news&public=true`;

      const res = await fetch(url);

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        console.error(`[CryptoPanic API ERROR for ${symbol}] Not JSON.`, text.slice(0, 200));
        logs.push({ symbol, status: 'error', reason: 'Invalid CryptoPanic response' });
        continue;
      }

      const json = await res.json();

      if (!json.results || !Array.isArray(json.results)) {
        console.warn(`[CryptoPanic WARNING] Empty news for ${symbol}`);
        logs.push({ symbol, status: 'warning', reason: 'Empty news' });
        continue;
      }

      for (const item of json.results) {
        const cryptopanic_news_id = item.id;
        const created_at = item.published_at || item.created_at;
        const title = item.title || 'Untitled';

        const { data: existing, error: checkError } = await supabase
          .from('coin_news')
          .select('id')
          .eq('cryptopanic_news_id', cryptopanic_news_id)
          .maybeSingle();

        if (checkError) {
          console.error(`[Supabase SELECT error for ${symbol}]`, checkError);
          logs.push({ symbol, title, status: 'db_check_error', reason: checkError.message });
          continue;
        }

        if (existing) {
          console.log(`[Skip] News already exists: ${cryptopanic_news_id}`);
          logs.push({ symbol, title, status: 'skipped', reason: 'Already exists' });
          continue;
        }

        const { error: insertError } = await supabase
          .from('coin_news')
          .insert([{ cryptopanic_news_id, coin: symbol, title, created_at }]);

        if (insertError) {
          console.error(`[Supabase INSERT error for ${symbol}]`, insertError);
          logs.push({ symbol, title, status: 'db_insert_error', reason: insertError.message });
        } else {
          console.log(`[Inserted] ${symbol} - ${title}`);
          logs.push({ symbol, title, status: 'inserted' });
        }
      }

      // ✅ Slight delay to avoid API flood
      await delay(300); // 300ms between each symbol
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Completed fetching news.', logs }),
    };
  } catch (err) {
    console.error('[storeNewsToSupabase ERROR]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Unknown error' }),
    };
  }
};
