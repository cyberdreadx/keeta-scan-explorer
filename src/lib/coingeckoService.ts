const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoPrice {
  currentPrice: string;
  priceChange24h: number;
  marketCap: string;
  volume24h: string;
  lastUpdated?: number;
}

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

export const coingeckoService = {
  async getKeetaPrice(): Promise<CoinGeckoPrice | null> {
    try {
      // Using CoinGecko API to get Keeta (KTA) price
      // The coin ID for Keeta on CoinGecko is 'keeta'
      const response = await fetch(
        `${COINGECKO_API_BASE}/simple/price?ids=keeta&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true&include_last_updated_at=true`
      );

      if (!response.ok) {
        console.error('CoinGecko API error:', response.status);
        return null;
      }

      const data = await response.json();
      
      if (!data.keeta) {
        console.error('Keeta data not found in CoinGecko response');
        return null;
      }

      return {
        currentPrice: data.keeta.usd?.toFixed(6) || '0.00',
        priceChange24h: data.keeta.usd_24h_change || 0,
        marketCap: data.keeta.usd_market_cap?.toLocaleString() || '0',
        volume24h: data.keeta.usd_24h_vol?.toLocaleString() || '0',
        lastUpdated: data.keeta.last_updated_at ? data.keeta.last_updated_at * 1000 : Date.now(),
      };
    } catch (error) {
      console.error('Error fetching Keeta price from CoinGecko:', error);
      return null;
    }
  },

  async getKeetaPriceHistory(days: number = 7): Promise<PriceHistoryPoint[]> {
    try {
      // Fetch historical market data
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/keeta/market_chart?vs_currency=usd&days=${days}&interval=daily`
      );

      if (!response.ok) {
        console.error('CoinGecko API error:', response.status);
        return [];
      }

      const data = await response.json();
      
      if (!data.prices || !Array.isArray(data.prices)) {
        console.error('Invalid price history data');
        return [];
      }

      // Transform to our format
      return data.prices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price,
      }));
    } catch (error) {
      console.error('Error fetching Keeta price history:', error);
      return [];
    }
  },
};
