const fetch = require('node-fetch');
const fetchTopCoins = require('../coinmarketcap');

jest.mock('node-fetch');

describe('fetchTopCoins', () => {
  it('returns simplified coin data', async () => {
    process.env.CMC_API_KEY = 'test-key';
    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            name: 'Bitcoin',
            symbol: 'BTC',
            quote: {
              USD: {
                price: 50000,
                market_cap: 1000000,
                volume_24h: 10000,
                percent_change_24h: 2,
                percent_change_7d: 5,
                percent_change_30d: 10,
                percent_change_90d: 20,
              }
            }
          }
        ]
      })
    };
    fetch.mockResolvedValue(mockResponse);

    const result = await fetchTopCoins(1);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      {
        id: 1,
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 50000,
        market_cap: 1000000,
        volume: 10000,
        percent_change_1d: 2,
        percent_change_7d: 5,
        percent_change_30d: 10,
        percent_change_90d: 20
      }
    ]);
  });
});
