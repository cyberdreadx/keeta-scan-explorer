const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const DEXSCREENER_API_BASE = 'https://api.dexscreener.com/latest/dex';

export interface CoinPrice {
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

// DexScreener service
const dexscreenerService = {
  async getKeetaPrice(): Promise<CoinPrice | null> {
    try {
      // Search for Keeta pairs on DexScreener
      const response = await fetch(`${DEXSCREENER_API_BASE}/search?q=keeta`);
      
      if (!response.ok) {
        console.error('DexScreener API error:', response.status);
        return null;
      }

      const data = await response.json();
      
      // Find the main KTA pair (usually the one with highest liquidity or volume)
      const ktaPair = data.pairs?.find((pair: any) => 
        pair.baseToken?.symbol?.toLowerCase() === 'kta' || 
        pair.baseToken?.symbol?.toLowerCase() === 'keeta'
      );

      if (!ktaPair) {
        console.error('Keeta pair not found on DexScreener');
        return null;
      }

      const priceUsd = parseFloat(ktaPair.priceUsd || '0');
      const priceChange24h = parseFloat(ktaPair.priceChange?.h24 || '0');
      const volume24h = parseFloat(ktaPair.volume?.h24 || '0');
      const liquidity = parseFloat(ktaPair.liquidity?.usd || '0');

      return {
        currentPrice: priceUsd.toFixed(6),
        priceChange24h: priceChange24h,
        marketCap: liquidity.toLocaleString(), // Using liquidity as proxy for market cap
        volume24h: volume24h.toLocaleString(),
        lastUpdated: Date.now(),
      };
    } catch (error) {
      console.error('Error fetching from DexScreener:', error);
      return null;
    }
  },
};

// CoinGecko service
const coingeckoService = {
  async getKeetaPrice(): Promise<CoinPrice | null> {
    try {
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

// Main price service with fallback logic
export const priceService = {
  async getKeetaPrice(): Promise<CoinPrice | null> {
    console.log('Fetching KTA price...');
    
    // Try DexScreener first (no rate limits)
    const dexPrice = await dexscreenerService.getKeetaPrice();
    if (dexPrice) {
      console.log('Price fetched from DexScreener');
      return dexPrice;
    }

    // Fallback to CoinGecko
    console.log('Falling back to CoinGecko');
    const cgPrice = await coingeckoService.getKeetaPrice();
    if (cgPrice) {
      console.log('Price fetched from CoinGecko');
      return cgPrice;
    }

    console.error('Failed to fetch price from all sources');
    return null;
  },

  async getKeetaPriceHistory(days: number = 7): Promise<PriceHistoryPoint[]> {
    // Currently only CoinGecko provides historical data
    // DexScreener doesn't have historical chart data in their free API
    return coingeckoService.getKeetaPriceHistory(days);
  },
};
