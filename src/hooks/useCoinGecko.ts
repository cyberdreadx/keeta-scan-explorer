import { useQuery } from '@tanstack/react-query';
import { coingeckoService } from '@/lib/coingeckoService';

export const useKeetaPrice = () => {
  return useQuery({
    queryKey: ['keeta-price'],
    queryFn: () => coingeckoService.getKeetaPrice(),
    refetchInterval: 60000, // Refetch every 60 seconds (CoinGecko rate limit friendly)
  });
};
