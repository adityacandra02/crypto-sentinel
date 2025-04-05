const fetchTopCoins = require('./utils/coinmarketcap');
require('dotenv').config();

exports.handler = async function (event, context) {
  try {
    const coins = await fetchTopCoins(10);
    return {
      statusCode: 200,
      body: JSON.stringify({ coins }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
