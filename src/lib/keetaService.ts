import * as KeetaNet from '@keetanetwork/keetanet-client';

// Initialize a client to fetch network-level data (kept for future use)
const createTestClient = () => {
  const seed = KeetaNet.lib.Account.generateRandomSeed({ asString: true });
  const account = KeetaNet.lib.Account.fromSeed(seed, 0);
  return KeetaNet.UserClient.fromNetwork('test', account);
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
      const response = await fetch('https://rep1.test.network.api.keeta.com/api/node/ledger/representatives');
      const data = await response.json();
      return data.representatives || [];
    } catch (error) {
      console.error('Error fetching representatives:', error);
      return [];
    }
  },

  // Get recent blocks from the network (prioritize fresh votes, fallback to rep history)
  async getRecentBlocks() {
    try {
      const representatives = await this.getRepresentatives();
      const activeReps = representatives.filter(rep => rep.weight !== "0x0").slice(0, 4);

      // 1) Try freshest data via votes/after across multiple lookback windows
      let allBlocks: Block[] = [];
      const lookbacksMin = [5, 60, 1440]; // 5 min, 1 hour, 24 hours

      for (const minutes of lookbacksMin) {
        const sinceISO = new Date(Date.now() - minutes * 60 * 1000).toISOString();
        const perRep = await Promise.all(
          activeReps.map(async (rep) => {
            try {
              const url = `${rep.endpoints.api}/node/ledger/votes/after?moment=${encodeURIComponent(sinceISO)}&limit=200`;
              const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
              const data = await res.json();
              const staples: any[] = Array.isArray(data) ? data : (data.voteStaples || data.history || []);

              const blocks: Block[] = [];
              staples.forEach((item: any) => {
                const staple = item?.voteStaple || item;
                if (staple?.blocks) blocks.push(...staple.blocks);
              });
              console.log(`✅ votes/after from ${rep.endpoints.api} (${minutes}m):`, blocks.length);
              return blocks;
            } catch (err) {
              console.error('❌ votes/after failed for rep', rep.endpoints.api, err);
              return [] as Block[];
            }
          })
        );
        allBlocks = perRep.flat();
        if (allBlocks.length > 0) break; // stop if we got data
      }

      // 2) Fallback to rep account history if votes/after returned nothing
      if (allBlocks.length === 0) {
        const allHistory: VoteStaple[] = [];
        for (const rep of activeReps) {
          try {
            const url = `${rep.endpoints.api}/node/ledger/account/${rep.representative}/history?limit=100`;
            const response = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
            const data = await response.json();
            if (data.history && data.history.length > 0) {
              allHistory.push(...data.history);
            }
          } catch (err) {
            console.error('❌ Error fetching history from rep:', err);
          }
        }
        allHistory.forEach((item: any) => {
          if (item?.voteStaple?.blocks) allBlocks.push(...item.voteStaple.blocks);
        });
      }

      // Dedupe by block hash
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
        .slice(0, 10);

      console.log('📋 Final blocks to display:', sorted);
      return sorted;
    } catch (error) {
      console.error('❌ Error fetching recent blocks:', error);
      return [];
    }
  },

  // Get recent transactions (same source as blocks: votes/after with fallback)
  async getRecentTransactions() {
    try {
      const representatives = await this.getRepresentatives();
      const activeReps = representatives.filter(rep => rep.weight !== "0x0").slice(0, 4);

      let allBlocks: Block[] = [];
      const lookbacksMin = [5, 60, 1440];

      for (const minutes of lookbacksMin) {
        const sinceISO = new Date(Date.now() - minutes * 60 * 1000).toISOString();
        const perRep = await Promise.all(
          activeReps.map(async (rep) => {
            try {
              const url = `${rep.endpoints.api}/node/ledger/votes/after?moment=${encodeURIComponent(sinceISO)}&limit=200`;
              const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
              const data = await res.json();
              const staples: any[] = Array.isArray(data) ? data : (data.voteStaples || data.history || []);

              const blocks: Block[] = [];
              staples.forEach((item: any) => {
                const staple = item?.voteStaple || item;
                if (staple?.blocks) blocks.push(...staple.blocks);
              });
              console.log(`✅ votes/after (tx) from ${rep.endpoints.api} (${minutes}m):`, blocks.length);
              return blocks;
            } catch (err) {
              console.error('❌ votes/after (tx) failed for rep', rep.endpoints.api, err);
              return [] as Block[];
            }
          })
        );
        allBlocks = perRep.flat();
        if (allBlocks.length > 0) break;
      }

      if (allBlocks.length === 0) {
        const allHistory: VoteStaple[] = [];
        for (const rep of activeReps) {
          try {
            const url = `${rep.endpoints.api}/node/ledger/account/${rep.representative}/history?limit=100`;
            const response = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
            const data = await response.json();
            if (data.history && data.history.length > 0) {
              allHistory.push(...data.history);
            }
          } catch (err) {
            console.error('❌ Error fetching history from rep:', err);
          }
        }
        allHistory.forEach((item: any) => {
          if (item?.voteStaple?.blocks) allBlocks.push(...item.voteStaple.blocks);
        });
      }

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
        .slice(0, 10);

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
