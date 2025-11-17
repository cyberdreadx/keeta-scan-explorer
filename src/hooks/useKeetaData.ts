import { useQuery } from '@tanstack/react-query';
import { keetaService } from '@/lib/keetaService';

export const useNetworkStats = () => {
  return useQuery({
    queryKey: ['network-stats'],
    queryFn: () => keetaService.getNetworkStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useRecentBlocks = () => {
  return useQuery({
    queryKey: ['recent-blocks'],
    queryFn: () => keetaService.getRecentBlocks(),
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

export const useRecentTransactions = () => {
  return useQuery({
    queryKey: ['recent-transactions'],
    queryFn: () => keetaService.getRecentTransactions(),
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

export const useAccountInfo = (address: string | undefined) => {
  return useQuery({
    queryKey: ['account-info', address],
    queryFn: () => address ? keetaService.getAccountInfo(address) : null,
    enabled: !!address,
  });
};

export const useRepresentatives = () => {
  return useQuery({
    queryKey: ['representatives'],
    queryFn: () => keetaService.getRepresentatives(),
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useBaseAnchor = () => {
  return useQuery({
    queryKey: ['base-anchor'],
    queryFn: () => keetaService.getBaseAnchor(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
