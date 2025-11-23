import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import LatestBlocks from "@/components/LatestBlocks";
import LatestTransactions from "@/components/LatestTransactions";
import RecentActivity from "@/components/RecentActivity";
import { Box, TrendingDown, Shield, Network } from "lucide-react";
import { useNetworkStats, useRecentBlocks } from "@/hooks/useKeetaData";
import { useKeetaPrice, useKeetaPriceHistory } from "@/hooks/useCoinGecko";
import { useEffect, useState } from "react";
import { OperationsPerBlockChart } from "@/components/charts/OperationsPerBlockChart";
import { OperationTypesChart } from "@/components/charts/OperationTypesChart";
import { PriceHistoryChart } from "@/components/charts/PriceHistoryChart";
import { LiveIndicator } from "@/components/LiveIndicator";
import { getOperationType } from "@/lib/keetaOperations";

const Home = () => {
  const { data: networkStats } = useNetworkStats();
  const { data: recentBlocks = [] } = useRecentBlocks();
  const { data: ktaPrice } = useKeetaPrice();
  const { data: priceHistory = [] } = useKeetaPriceHistory(7);
  const [tpsData, setTpsData] = useState<any[]>([]);
  const [operationData, setOperationData] = useState<any[]>([]);

  useEffect(() => {
    if (recentBlocks.length > 0) {
      // Calculate TPS over time (last 10 blocks for compact view)
      const tpsTimeline = recentBlocks.slice(0, 10).reverse().map((block: any, index: number) => {
        const time = new Date(block.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const ops = block.operations?.length || 0;
        return {
          time,
          tps: ops,
          index: index + 1
        };
      });
      setTpsData(tpsTimeline);

      // Count operation types
      const opCounts: { [key: number]: number } = {};
      recentBlocks.forEach((block: any) => {
        block.operations?.forEach((op: any) => {
          const type = typeof op.type === 'number' ? op.type : parseInt(op.type);
          if (!isNaN(type)) {
            opCounts[type] = (opCounts[type] || 0) + 1;
          }
        });
      });

      const pieData = Object.entries(opCounts).map(([type, count]) => ({
        name: getOperationType(parseInt(type)).name,
        value: count
      }));
      setOperationData(pieData);
    }
  }, [recentBlocks]);

  return (
    <>
      <Header />

      {/* Stats Section */}
      <section className="w-full max-w-[100vw] overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          {/* Live Indicator */}
          <div className="mb-6">
            <LiveIndicator lastUpdated={ktaPrice?.lastUpdated} isLive={true} />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="KTA Price"
            value={ktaPrice?.currentPrice ? `$${ktaPrice.currentPrice}` : "$0.00"}
            icon={TrendingDown}
            change={ktaPrice?.priceChange24h ? `${ktaPrice.priceChange24h > 0 ? '+' : ''}${ktaPrice.priceChange24h.toFixed(2)}% (24h)` : "N/A"}
            isLoading={!ktaPrice}
          />
          <StatsCard
            title="Representatives"
            value={networkStats?.activeRepresentatives?.toString() || "0"}
            icon={Box}
            subtitle="Active Representatives on Network"
            isLoading={!networkStats}
          />
          <StatsCard
            title="Blocks"
            value={networkStats?.nodeStats?.ledger?.blockCount?.toLocaleString() || "0"}
            icon={Shield}
            subtitle="Total Blocks on Network"
            isLoading={!networkStats}
          />
          <StatsCard
            title="Transactions"
            value={networkStats?.nodeStats?.ledger?.transactionCount?.toLocaleString() || "0"}
            icon={Network}
            subtitle="Total Transactions on Network"
            isLoading={!networkStats}
          />
        </div>

          {/* Price History Chart */}
          <div className="mb-8">
            <PriceHistoryChart data={priceHistory} height={300} />
          </div>

          {/* Charts Preview */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-8">
            <OperationsPerBlockChart data={tpsData} height={200} />
            <OperationTypesChart data={operationData} height={200} />
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
        </div>
      </section>
    </>
  );
};

export default Home;
