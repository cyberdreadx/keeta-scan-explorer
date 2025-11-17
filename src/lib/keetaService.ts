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

  // Get base anchor information
  async getBaseAnchor() {
    try {
      // Try the ledger info endpoint
      let response = await fetch('https://rep4.main.network.api.keeta.com/api/node/ledger/info');
      
      if (!response.ok) {
        // Fallback to node info
        response = await fetch('https://rep4.main.network.api.keeta.com/api/node/info');
      }
      
      const data = await response.json();
      console.log('📍 Base Anchor API Response:', data);
      
      // Try different possible field names
      const hash = data.baseAnchor?.hash || data.baseAnchor || data.base_anchor?.hash || data.base_anchor || data.anchor?.hash || data.anchor;
      const height = data.baseAnchorHeight || data.base_anchor_height || data.anchorHeight || 0;
      const timestamp = data.baseAnchorTimestamp || data.base_anchor_timestamp || data.anchorTimestamp || Date.now() / 1000;
      
      return {
        hash: hash || 'N/A',
        height,
        timestamp,
      };
    } catch (error) {
      console.error('❌ Error fetching base anchor:', error);
      // Return a fallback using the most recent block from history as base anchor
      try {
        const historyResponse = await fetch('https://rep4.main.network.api.keeta.com/api/node/ledger/history?limit=1');
        const historyData = await historyResponse.json();
        const latestBlock = historyData.history?.[0]?.blocks?.[0];
        
        if (latestBlock) {
          console.log('📍 Using latest block as base anchor:', latestBlock);
          return {
            hash: latestBlock.$hash || latestBlock.hash,
            height: 0,
            timestamp: latestBlock.date ? new Date(latestBlock.date).getTime() / 1000 : Date.now() / 1000,
          };
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
      return null;
    }
  },
};
