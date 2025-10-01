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

  // Get recent blocks from active representatives
  async getRecentBlocks() {
    try {
      const representatives = await this.getRepresentatives();
      const activeReps = representatives.filter(rep => rep.weight !== "0x0").slice(0, 3);
      
      const allHistory: VoteStaple[] = [];
      
      for (const rep of activeReps) {
        try {
          const url = `${rep.endpoints.api}/node/ledger/account/${rep.representative}/history?limit=50`;
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.history && data.history.length > 0) {
            allHistory.push(...data.history);
          }
        } catch (err) {
          console.error('❌ Error fetching history from rep:', err);
        }
      }
      
      const allBlocks: Block[] = [];
      allHistory.forEach(item => {
        if (item.voteStaple?.blocks) {
          allBlocks.push(...item.voteStaple.blocks);
        }
      });
      
      const sorted = allBlocks
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
      
      console.log('📋 Final blocks to display:', sorted);
      return sorted;
    } catch (error) {
      console.error('❌ Error fetching recent blocks:', error);
      return [];
    }
  },

  // Get recent transactions from active representatives
  async getRecentTransactions() {
    try {
      const representatives = await this.getRepresentatives();
      const activeReps = representatives.filter(rep => rep.weight !== "0x0").slice(0, 3);
      
      const allHistory: VoteStaple[] = [];
      
      for (const rep of activeReps) {
        try {
          const url = `${rep.endpoints.api}/node/ledger/account/${rep.representative}/history?limit=50`;
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.history && data.history.length > 0) {
            allHistory.push(...data.history);
          }
        } catch (err) {
          console.error('❌ Error fetching history from rep:', err);
        }
      }
      
      const allBlocks: Block[] = [];
      allHistory.forEach(item => {
        if (item.voteStaple?.blocks) {
          allBlocks.push(...item.voteStaple.blocks);
        }
      });
      
      const sorted = allBlocks
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
