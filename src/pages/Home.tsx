import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import LatestBlocks from "@/components/LatestBlocks";
import LatestTransactions from "@/components/LatestTransactions";
import { Box, ArrowRightLeft, Users, Activity } from "lucide-react";
import { useNetworkStats } from "@/hooks/useKeetaData";

const Home = () => {
  const { data: networkStats, isLoading } = useNetworkStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-50" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">
              Keeta Network Explorer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track transactions, explore blocks, and analyze the Keeta blockchain in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Blocks"
            value={isLoading ? "..." : networkStats?.totalBlocks?.toString() || "0"}
            icon={Box}
            change="From test account"
          />
          <StatsCard
            title="Transactions"
            value={isLoading ? "..." : networkStats?.totalTransactions?.toString() || "0"}
            icon={ArrowRightLeft}
            change="Real-time data"
          />
          <StatsCard
            title="Network"
            value="Keeta Test"
            icon={Users}
            change="Connected"
          />
          <StatsCard
            title="Status"
            value={isLoading ? "Loading..." : "Live"}
            icon={Activity}
          />
        </div>

        {/* Latest Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          <LatestBlocks />
          <LatestTransactions />
        </div>
      </div>
    </div>
  );
};

export default Home;
