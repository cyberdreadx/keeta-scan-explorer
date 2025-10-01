import { useQuery } from '@tanstack/react-query';
import { keetaService } from '@/lib/keetaService';

export const useNetworkStats = () => {
  return useQuery({
    queryKey: ['network-stats'],
    queryFn: () => Promise.resolve({ totalRepresentatives: 0, activeRepresentatives: 0, totalWeight: "0", representatives: [] }),
    enabled: false, // Disabled for now
  });
};

export const useRecentBlocks = () => {
  return useQuery({
    queryKey: ['recent-blocks'],
    queryFn: () => Promise.resolve([]),
    enabled: false, // Disabled for now
  });
};

export const useRecentTransactions = () => {
  return useQuery({
    queryKey: ['recent-transactions'],
    queryFn: () => Promise.resolve([]),
    enabled: false, // Disabled for now
  });
};

export const useAccountInfo = (address: string | undefined) => {
  return useQuery({
    queryKey: ['account-info', address],
    queryFn: () => Promise.resolve(null),
    enabled: false, // Disabled for now
  });
};
