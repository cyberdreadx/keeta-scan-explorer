import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Clock, ArrowRightLeft, User } from "lucide-react";

const BlockDetail = () => {
  const { id } = useParams();

  // Mock data
  const block = {
    number: id,
    hash: "0x" + Math.random().toString(16).substring(2, 66),
    timestamp: new Date().toISOString(),
    transactions: 156,
    miner: "0x" + Math.random().toString(16).substring(2, 42),
    difficulty: "2,345,678,901,234",
    totalDifficulty: "12,345,678,901,234,567",
    size: "34,567 bytes",
    gasUsed: "12,456,789 (82.4%)",
    gasLimit: "15,000,000",
    reward: "2.5 KTA",
    parentHash: "0x" + Math.random().toString(16).substring(2, 66),
  };

  const transactions = Array.from({ length: 10 }, (_, i) => ({
    hash: "0x" + Math.random().toString(16).substring(2, 66),
    from: "0x" + Math.random().toString(16).substring(2, 42),
    to: "0x" + Math.random().toString(16).substring(2, 42),
    value: (Math.random() * 100).toFixed(4) + " KTA",
    status: "success" as const,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Box className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Block #{block.number}</h1>
          </div>
          <p className="text-muted-foreground">Block details and transactions</p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Box className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">Coming Soon</p>
              <p className="text-sm text-muted-foreground">
                Block details will be displayed here once connected to the network.
              </p>
            </div>
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlockDetail;
