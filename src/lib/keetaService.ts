import * as KeetaNet from '@keetanetwork/keetanet-client';

// Initialize a client to fetch network-level data
const getTestClient = () => {
  const seed = KeetaNet.lib.Account.generateRandomSeed({ asString: true });
  const account = KeetaNet.lib.Account.fromSeed(seed, 0);
  return KeetaNet.UserClient.fromNetwork('test', account);
};

let clientInstance: any = null;
const getClient = () => {
  if (!clientInstance) {
    clientInstance = getTestClient();
  }
  return clientInstance;
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

  // Get recent blocks using Keeta client
  async getRecentBlocks() {
    try {
      const client = getClient();
      
      // Get recent vote staples from the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const voteStaples = await client.ledger.getVoteStaplesAfter(oneHourAgo, 50);
      
      console.log('📊 Vote staples fetched:', voteStaples.length);
      
      // Extract blocks from vote staples
      const allBlocks: Block[] = [];
      voteStaples.forEach(staple => {
        if (staple.blocks) {
          allBlocks.push(...staple.blocks);
        }
      });
      
      console.log('📊 Blocks extracted:', allBlocks.length);
      
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

  // Get recent transactions using Keeta client
  async getRecentTransactions() {
    try {
      const client = getClient();
      
      // Get recent vote staples from the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const voteStaples = await client.ledger.getVoteStaplesAfter(oneHourAgo, 50);
      
      console.log('📊 Vote staples for transactions:', voteStaples.length);
      
      // Extract blocks from vote staples
      const allBlocks: Block[] = [];
      voteStaples.forEach(staple => {
        if (staple.blocks) {
          allBlocks.push(...staple.blocks);
        }
      });
      
      console.log('📊 Transaction blocks extracted:', allBlocks.length);
      
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

  // Get account info using Keeta client
  async getAccountInfo(address: string) {
    try {
      const client = getClient();
      
      console.log('🔍 Fetching account info for:', address);
      
      // Get account history
      const history = await client.ledger.getHistory(address, null, 100);
      
      console.log('📊 Account history fetched:', history.length);
      
      // Extract all blocks from history
      const allBlocks: Block[] = [];
      history.forEach((staple) => {
        if (staple.blocks) {
          allBlocks.push(...staple.blocks);
        }
      });
      
      // Filter transactions involving this address
      const addressTransactions = allBlocks.filter(block => 
        block.account === address || 
        block.operations?.some((op: any) => op.to === address)
      );
      
      console.log('📋 Transactions for address:', addressTransactions.length);
      
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
