import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { Box, TrendingDown, Shield, Network } from "lucide-react";
import { useNetworkStats } from "@/hooks/useKeetaData";

const Statistics = () => {
  const { data: networkStats } = useNetworkStats();

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Network Statistics</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </>
  );
};

export default Statistics;
