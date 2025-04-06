// frontend/src/services/api.js

export async function getMarketData() {
  try {
    const response = await fetch('/.netlify/functions/fetchMarketData');
    if (!response.ok) throw new Error('Failed to fetch market data');
    const data = await response.json();
    return data.coins || data; // fallback in case it's a flat array
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
}

export async function getWatchlistData() {
  try {
    const response = await fetch('/.netlify/functions/fetchWatchlistData');
    if (!response.ok) throw new Error('Failed to fetch watchlist data');
    const data = await response.json();
    return data.coins || data;
  } catch (error) {
    console.error('Error fetching watchlist data:', error);
    return [];
  }
}
