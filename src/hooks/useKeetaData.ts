import { useQuery } from '@tanstack/react-query';
import { keetaService } from '@/lib/keetaService';

export const useNetworkStats = () => {
  return useQuery({
    queryKey: ['network-stats'],
    queryFn: () => keetaService.getNetworkStats(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useRecentBlocks = () => {
  return useQuery({
    queryKey: ['recent-blocks'],
    queryFn: () => keetaService.getRecentBlocks(),
    refetchInterval: 30000,
  });
};

export const useRecentTransactions = () => {
  return useQuery({
    queryKey: ['recent-transactions'],
    queryFn: () => keetaService.getRecentTransactions(),
    refetchInterval: 30000,
  });
};

export const useAccountInfo = (address: string | undefined) => {
  return useQuery({
    queryKey: ['account-info', address],
    queryFn: () => address ? keetaService.getAccountInfo(address) : null,
    enabled: !!address,
  });
};
