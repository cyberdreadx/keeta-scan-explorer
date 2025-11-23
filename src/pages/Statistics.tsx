import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { Box, TrendingDown, Shield, Zap } from "lucide-react";
import { useNetworkStats, useRecentBlocks } from "@/hooks/useKeetaData";
import { useEffect, useState } from "react";
import { OperationsPerBlockChart } from "@/components/charts/OperationsPerBlockChart";
import { OperationTypesChart } from "@/components/charts/OperationTypesChart";
import { BlockTypesChart } from "@/components/charts/BlockTypesChart";
import { BlockProductionChart } from "@/components/charts/BlockProductionChart";
import { getOperationType } from "@/lib/keetaOperations";

const Statistics = () => {
  const { data: networkStats } = useNetworkStats();
  const { data: recentBlocks = [] } = useRecentBlocks();
  const [tpsData, setTpsData] = useState<any[]>([]);
  const [operationData, setOperationData] = useState<any[]>([]);

  useEffect(() => {
    if (recentBlocks.length > 0) {
      // Calculate TPS over time (last 20 blocks)
      const tpsTimeline = recentBlocks.slice(0, 20).reverse().map((block: any, index: number) => {
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

  const blockDistribution = [
    { name: 'Opening Blocks', value: recentBlocks.filter((b: any) => b.$opening).length },
    { name: 'Standard Blocks', value: recentBlocks.filter((b: any) => !b.$opening).length }
  ];

  const avgTps = tpsData.length > 0 
    ? (tpsData.reduce((sum, item) => sum + item.tps, 0) / tpsData.length).toFixed(2)
    : '0';

  return (
    <>
      <Header />
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Network Statistics</h1>
        
        {/* Overview Stats */}
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
            subtitle="Active Representatives"
          />
          <StatsCard
            title="Total Blocks"
            value={networkStats?.nodeStats?.ledger?.blockCount?.toLocaleString() || "0"}
            icon={Shield}
            subtitle="On Network"
          />
          <StatsCard
            title="Avg TPS"
            value={avgTps}
            icon={Zap}
            subtitle="Operations per Block"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <OperationsPerBlockChart data={tpsData} height={220} />
          <OperationTypesChart data={operationData} height={220} />
          <BlockTypesChart data={blockDistribution} height={220} />
          <BlockProductionChart data={tpsData} height={220} />
        </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;
