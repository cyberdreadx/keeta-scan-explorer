import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BaseTransaction {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  tokenSymbol?: string;
  tokenName?: string;
  tokenDecimal?: string;
  isError: string;
}

const fetchBaseTransactions = async (address: string): Promise<BaseTransaction[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('basescan-proxy', {
      body: { address },
    });

    if (error) {
      console.error('Error fetching Base transactions:', error);
      return [];
    }

    if (data?.result && Array.isArray(data.result)) {
      return data.result;
    }

    return [];
  } catch (err) {
    console.error('Exception fetching Base transactions:', err);
    return [];
  }
};

export const useBaseTransactions = (address: string) => {
  return useQuery({
    queryKey: ['base-transactions', address],
    queryFn: () => fetchBaseTransactions(address),
    refetchInterval: 30000,
    enabled: !!address,
  });
};
