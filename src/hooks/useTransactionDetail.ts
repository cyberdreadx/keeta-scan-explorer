import { useQuery } from '@tanstack/react-query';
import { keetaService } from '@/lib/keetaService';

export const useTransactionDetail = (hash: string | undefined) => {
  return useQuery({
    queryKey: ['transaction-detail', hash],
    queryFn: async () => {
      if (!hash) return null;
      
      // Fetch recent blocks to find the transaction
      const blocks = await keetaService.getRecentBlocks();
      
      // Find the transaction by hash
      const transaction = blocks.find((block: any) => 
        (block.$hash || block.hash) === hash
      );
      
      return transaction || null;
    },
    enabled: !!hash,
  });
};
