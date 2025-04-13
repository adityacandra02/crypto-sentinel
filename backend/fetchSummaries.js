// backend/fetchSummaries.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

exports.handler = async () => {
  try {
    const { data, error } = await supabase
      .from('coin_summaries')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
