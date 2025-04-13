// backend/triggerStoreNews.js
const storeNews = require('./storeNewsToSupabase.js');

exports.handler = async function (event, context) {
  try {
    const result = await storeNews.handler(event, context);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'News stored successfully.', result }),
    };
  } catch (err) {
    console.error('[Trigger StoreNews ERROR]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to store news.' }),
    };
  }
};
