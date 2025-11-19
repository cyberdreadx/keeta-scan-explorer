import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase.functions.invoke('keetools-proxy', {
        body: { tokenAddress }
      });
      
      if (error) {
        console.error('Error fetching token statistics:', error);
        return null;
      }

      // If edge function returned an error payload, treat as no data
      if (!data || (data as any).error) {
        if ((data as any)?.error) {
          console.warn('Keetools reported error for token statistics:', (data as any).error);
        }
        return null;
      }
      
      return data as TokenStatistics;
    } catch (error) {
      console.error('Error fetching token statistics:', error);
      return null;
    }
  },
};
