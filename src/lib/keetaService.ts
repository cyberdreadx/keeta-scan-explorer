import * as KeetaNet from '@keetanetwork/keetanet-client';

// Initialize a client to fetch network-level data
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
  account: string;
  previous: string;
  network: number;
  operations: any[];
  date: string;
  signature: string;
}

export interface VoteStaple {
  blocks: Block[];
  votes: any[];
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
      console.log('📊 Representatives:', representatives);
      
      const activeReps = representatives.filter(rep => rep.weight !== "0x0").slice(0, 3);
      console.log('✅ Active Representatives:', activeReps);
      
      const allBlocks: Block[] = [];
      
      // Fetch chain data from multiple representatives
      for (const rep of activeReps) {
        try {
          const url = `${rep.endpoints.api}/node/ledger/account/${rep.representative}/chain?start=HEAD&limit=50`;
          console.log('🔍 Fetching blocks from:', url);
          
          const response = await fetch(url);
          const data = await response.json();
          console.log('📦 Block response:', data);
          
          if (data.blocks && data.blocks.length > 0) {
            console.log('✅ Found blocks:', data.blocks.length);
            allBlocks.push(...data.blocks);
          } else {
            console.log('⚠️ No blocks in response');
          }
        } catch (err) {
          console.error('❌ Error fetching blocks from rep:', err);
        }
      }
      
      console.log('📊 Total blocks collected:', allBlocks.length);
      
      // Sort by date (most recent first)
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
      
      // Fetch history data from multiple representatives
      for (const rep of activeReps) {
        try {
          const url = `${rep.endpoints.api}/node/ledger/account/${rep.representative}/history?limit=50`;
          console.log('🔍 Fetching history from:', url);
          
          const response = await fetch(url);
          const data = await response.json();
          console.log('📜 History response:', data);
          
          if (data.history && data.history.length > 0) {
            console.log('✅ Found history items:', data.history.length);
            allHistory.push(...data.history);
          } else {
            console.log('⚠️ No history in response');
          }
        } catch (err) {
          console.error('❌ Error fetching history from rep:', err);
        }
      }
      
      console.log('📊 Total history items:', allHistory.length);
      
      // Extract blocks from vote staples and sort
      const allBlocks: Block[] = [];
      allHistory.forEach(staple => {
        if (staple.blocks) {
          allBlocks.push(...staple.blocks);
        }
      });
      
      console.log('📊 Blocks extracted from history:', allBlocks.length);
      
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

  // Get account info
  async getAccountInfo(address: string) {
    try {
      const representatives = await this.getRepresentatives();
      const rep = representatives[0];
      
      const response = await fetch(
        `${rep.endpoints.api}/node/ledger/account/${address}/chain?start=HEAD&limit=1`
      );
      const data = await response.json();
      
      return {
        address,
        balance: "0 KTA", // Balance calculation would require more API exploration
        transactions: data.blocks?.length || 0,
      };
    } catch (error) {
      console.error('Error fetching account info:', error);
      return null;
    }
  },
};
