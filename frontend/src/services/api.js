export async function getMarketData() {
    try {
      const response = await fetch('/.netlify/functions/fetchMarketData');
      if (!response.ok) throw new Error('Failed to fetch market data');
      const data = await response.json();
      return data.coins;
    } catch (error) {
      console.error('Error fetching market data:', error);
      return [];
    }
  }
  