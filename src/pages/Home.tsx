import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import LatestBlocks from "@/components/LatestBlocks";
import LatestTransactions from "@/components/LatestTransactions";
import RecentActivity from "@/components/RecentActivity";
import { Box, TrendingDown, Shield, Network } from "lucide-react";
import { useNetworkStats } from "@/hooks/useKeetaData";

const Home = () => {
  const { data: networkStats } = useNetworkStats();

  return (
    <>
      <Header />

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="KTA Price"
            value="$0.289631"
            icon={TrendingDown}
            change="-9.01% (24h)"
          />
          <StatsCard
            title="Representatives"
            value={networkStats?.activeRepresentatives?.toString() || "0"}
            icon={Box}
            subtitle="Active Representatives on Network"
          />
          <StatsCard
            title="Blocks"
            value={networkStats?.nodeStats?.ledger?.blockCount?.toLocaleString() || "0"}
            icon={Shield}
            subtitle="Total Blocks on Network"
          />
          <StatsCard
            title="Transactions"
            value={networkStats?.nodeStats?.ledger?.transactionCount?.toLocaleString() || "0"}
            icon={Network}
            subtitle="Total Transactions on Network"
          />
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <RecentActivity />
        </div>

        {/* Latest Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          <LatestBlocks />
          <LatestTransactions />
        </div>
      </section>
    </>
  );
};

export default Home;
