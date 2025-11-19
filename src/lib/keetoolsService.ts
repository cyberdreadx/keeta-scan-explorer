const KEETOOLS_API_BASE = 'https://api.keetools.org/api';

export interface TokenStatistics {
  totalSupply: string;
  circulatingSupply: string;
  holders: string;
  volume24h: string;
  volumeTotal: string;
  transactionCount: string;
  ktaExchangeRate: string;
  currentPrice: string;
  priceChange24h: number;
  price24hAgo: string;
}

export const keetoolsService = {
  async getTokenStatistics(tokenAddress: string): Promise<TokenStatistics | null> {
    try {
      const response = await fetch(
        `${KEETOOLS_API_BASE}/tokens/${tokenAddress}/statistics`
      );
      
      if (!response.ok) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching token statistics:', error);
      return null;
    }
  },
};
