import { useQuery } from '@tanstack/react-query';
import { keetoolsService } from '@/lib/keetoolsService';

export const useTokenStatistics = (tokenAddress: string) => {
  return useQuery({
    queryKey: ['token-statistics', tokenAddress],
    queryFn: () => keetoolsService.getTokenStatistics(tokenAddress),
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: !!tokenAddress,
  });
};
