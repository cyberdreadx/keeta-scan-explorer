import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, TrendingDown, Shield, Network, Activity, Zap } from "lucide-react";
import { useNetworkStats, useRecentBlocks } from "@/hooks/useKeetaData";
import { LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

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
      const opCounts: { [key: string]: number } = {};
      recentBlocks.forEach((block: any) => {
        block.operations?.forEach((op: any) => {
          const type = op.type?.toString() || 'unknown';
          opCounts[type] = (opCounts[type] || 0) + 1;
        });
      });

      const opTypeNames: { [key: string]: string } = {
        '0': 'Send',
        '1': 'Receive',
        '2': 'Change Rep',
        '3': 'Admin Anchor',
        '4': 'Set Info',
        '5': 'Admin Supply',
        '6': 'Admin Burn',
        '7': 'Admin Init',
        '8': 'Admin Swap'
      };

      const pieData = Object.entries(opCounts).map(([type, count]) => ({
        name: opTypeNames[type] || `Type ${type}`,
        value: count
      }));
      setOperationData(pieData);
    }
  }, [recentBlocks]);

  const COLORS = ['hsl(262, 83%, 58%)', 'hsl(180, 100%, 45%)', 'hsl(142, 71%, 45%)', 'hsl(0, 84%, 60%)', 'hsl(240, 5%, 65%)', 'hsl(280, 70%, 60%)', 'hsl(45, 100%, 50%)', 'hsl(320, 80%, 55%)'];

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
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* TPS Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Operations Per Block (Recent 20)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={tpsData}>
                  <defs>
                    <linearGradient id="colorTps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tps" 
                    stroke="hsl(262, 83%, 58%)" 
                    fillOpacity={1} 
                    fill="url(#colorTps)" 
                    name="Operations"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Operation Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-accent" />
                Operation Types Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={operationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {operationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Block Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5 text-success" />
                Block Types Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={blockDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {blockDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(142, 71%, 45%)' : 'hsl(180, 100%, 45%)'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Network Activity Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Block Production Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tpsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="tps" 
                    stroke="hsl(180, 100%, 45%)" 
                    strokeWidth={2}
                    name="Operations"
                    dot={{ fill: 'hsl(180, 100%, 45%)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Statistics;
