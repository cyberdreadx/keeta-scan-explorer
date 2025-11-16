import * as KeetaNet from '@keetanetwork/keetanet-client';

// Initialize a client to fetch network-level data (kept for future use)
const createMainnetClient = () => {
  const seed = KeetaNet.lib.Account.generateRandomSeed({ asString: true });
  const account = KeetaNet.lib.Account.fromSeed(seed, 0);
  return KeetaNet.UserClient.fromNetwork('main', account);
};

export interface Representative {
  representative: string;
  weight: string;
  endpoints: {
    p2p: string;
    api: string;
  };
}

export interface Block {
  hash: string;
  $hash?: string;
  account: string;
  previous: string;
  network: number;
  operations: any[];
  date: string;
  signature: string;
  $opening?: boolean;
}

export interface VoteStaple {
  voteStaple: {
    blocks: Block[];
    votes: any[];
  };
}

export const keetaService = {
  // Get network representatives (validators)
  async getRepresentatives(): Promise<Representative[]> {
    try {
      const response = await fetch('https://rep1.main.network.api.keeta.com/api/node/ledger/representatives');
      const data = await response.json();
      return data.representatives || [];
    } catch (error) {
      console.error('Error fetching representatives:', error);
      return [];
    }
  },

  // Get recent blocks from the network using global history endpoint
  async getRecentBlocks() {
    try {
      const url = 'https://rep4.main.network.api.keeta.com/api/node/ledger/history?limit=200';
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) return [];
      const data = await res.json();

      const allBlocks: Block[] = [];
      (data.history || []).forEach((item: any) => {
        if (item?.voteStaple?.blocks) allBlocks.push(...item.voteStaple.blocks);
        else if (item?.blocks) allBlocks.push(...item.blocks);
      });

      const seen = new Set<string>();
      const getHash = (b: any) => b?.hash || b?.$hash || b?.blockHash || '';
      const deduped = allBlocks.filter((b) => {
        const h = getHash(b);
        if (!h || seen.has(h)) return false;
        seen.add(h);
        return true;
      });

      const sorted = deduped
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20);

      console.log('📋 Final blocks to display:', sorted);
      return sorted;
    } catch (error) {
      console.error('❌ Error fetching recent blocks:', error);
      return [];
    }
  },

  // Get recent transactions using global history endpoint
  async getRecentTransactions() {
    try {
      const url = 'https://rep4.main.network.api.keeta.com/api/node/ledger/history?limit=200';
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) return [];
      const data = await res.json();

      const allBlocks: Block[] = [];
      (data.history || []).forEach((item: any) => {
        if (item?.voteStaple?.blocks) allBlocks.push(...item.voteStaple.blocks);
        else if (item?.blocks) allBlocks.push(...item.blocks);
      });

      const seen = new Set<string>();
      const getHash = (b: any) => b?.hash || b?.$hash || b?.blockHash || '';
      const deduped = allBlocks.filter((b) => {
        const h = getHash(b);
        if (!h || seen.has(h)) return false;
        seen.add(h);
        return true;
      });

      const sorted = deduped
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20);

      console.log('📋 Final transactions to display:', sorted);
      return sorted;
    } catch (error) {
      console.error('❌ Error fetching recent transactions:', error);
      return [];
    }
  },

  // Get network statistics
  async getNetworkStats() {
    try {
      // Fetch from node stats endpoint
      const statsResponse = await fetch('https://rep4.main.network.api.keeta.com/api/node/stats');
      const stats = await statsResponse.json();
      
      // Also get representatives for additional info
      const representatives = await this.getRepresentatives();
      const activeReps = representatives.filter(rep => rep.weight !== "0x0");
      
      // Calculate total weight
      const totalWeight = representatives.reduce((sum, rep) => {
        return sum + BigInt(rep.weight);
      }, BigInt(0));
      
      return {
        totalRepresentatives: representatives.length,
        activeRepresentatives: activeReps.length,
        totalWeight: totalWeight.toString(16),
        representatives,
        nodeStats: stats, // Include raw node stats
      };
    } catch (error) {
      console.error('Error fetching network stats:', error);
      return {
        totalRepresentatives: 0,
        activeRepresentatives: 0,
        totalWeight: "0",
        representatives: [],
      };
    }
  },

  // Get account info with full transaction history
  async getAccountInfo(address: string) {
    try {
      const representatives = await this.getRepresentatives();
      const rep = representatives.find(r => r.weight !== "0x0") || representatives[0];
      
      const response = await fetch(
        `${rep.endpoints.api}/node/ledger/account/${address}/history?limit=100`
      );
      const data = await response.json();
      
      const allBlocks: Block[] = [];
      if (data.history) {
        data.history.forEach((item: VoteStaple) => {
          if (item.voteStaple?.blocks) {
            allBlocks.push(...item.voteStaple.blocks);
          }
        });
      }
      
      const addressTransactions = allBlocks.filter(block => 
        block.account === address || 
        block.operations?.some((op: any) => op.to === address)
      );
      
      return {
        address,
        transactions: addressTransactions.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
        totalTransactions: addressTransactions.length,
      };
    } catch (error) {
      console.error('❌ Error fetching account info:', error);
      return null;
    }
  },
};
