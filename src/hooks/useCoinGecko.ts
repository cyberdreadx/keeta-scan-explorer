import { useQuery } from '@tanstack/react-query';
import { priceService } from '@/lib/priceService';

export const useKeetaPrice = () => {
  return useQuery({
    queryKey: ['keeta-price'],
    queryFn: () => priceService.getKeetaPrice(),
    refetchInterval: 30000, // Refetch every 30 seconds (DexScreener has no rate limits)
  });
};

export const useKeetaPriceHistory = (days: number = 7) => {
  return useQuery({
    queryKey: ['keeta-price-history', days],
    queryFn: () => priceService.getKeetaPriceHistory(days),
    refetchInterval: 600000, // Refetch every 10 minutes to avoid CoinGecko rate limits
    retry: 1,
  });
};
