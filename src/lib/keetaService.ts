import * as KeetaNet from '@keetanetwork/keetanet-client';

// Initialize a client to fetch network-level data
const createTestClient = () => {
  const seed = KeetaNet.lib.Account.generateRandomSeed({ asString: true });
  const account = KeetaNet.lib.Account.fromSeed(seed, 0);
  return KeetaNet.UserClient.fromNetwork('test', account);
};

export const keetaService = {
  // Get network statistics from a test account
  async getNetworkStats() {
    try {
      const client = createTestClient();
      const chain = await client.chain();
      const history = await client.history();
      
      return {
        latestBlock: chain.length > 0 ? chain[chain.length - 1] : null,
        totalBlocks: chain.length,
        totalTransactions: history.length,
        client, // Return client for further queries
      };
    } catch (error) {
      console.error('Error fetching network stats:', error);
      return {
        latestBlock: null,
        totalBlocks: 0,
        totalTransactions: 0,
        client: null,
      };
    }
  },

  // Get account info - for now using test data since we need to explore the API more
  async getAccountInfo(address: string) {
    try {
      // This is a placeholder - we'll need to explore the API to find the right method
      const client = createTestClient();
      return {
        address,
        balance: "0 KTA",
        transactions: 0,
      };
    } catch (error) {
      console.error('Error fetching account info:', error);
      return null;
    }
  },
};
