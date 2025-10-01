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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Block Height</p>
                  <p className="font-mono font-semibold">{block.number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{new Date(block.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{block.transactions} transactions</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Block Reward</p>
                  <p className="font-semibold text-success">{block.reward}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Hash</p>
                  <p className="font-mono text-sm break-all">{block.hash}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Parent Hash</p>
                  <p className="font-mono text-sm break-all">{block.parentHash}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Miner</p>
                  <Link
                    to={`/address/${block.miner}`}
                    className="font-mono text-sm text-primary hover:text-primary-glow transition-colors break-all"
                  >
                    {block.miner}
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Gas Used</p>
                  <p className="text-sm">{block.gasUsed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Gas Limit</p>
                  <p className="text-sm">{block.gasLimit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                  <p className="text-sm">{block.difficulty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Size</p>
                  <p className="text-sm">{block.size}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-accent" />
                Transactions ({transactions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.hash}
                    className="p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                        <Link
                          to={`/tx/${tx.hash}`}
                          className="font-mono text-sm text-primary hover:text-primary-glow transition-colors break-all"
                        >
                          {tx.hash}
                        </Link>
                      </div>
                      <Badge variant="default" className="text-xs">
                        {tx.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">From</p>
                        <Link
                          to={`/address/${tx.from}`}
                          className="font-mono text-primary hover:text-primary-glow transition-colors break-all"
                        >
                          {tx.from}
                        </Link>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">To</p>
                        <Link
                          to={`/address/${tx.to}`}
                          className="font-mono text-primary hover:text-primary-glow transition-colors break-all"
                        >
                          {tx.to}
                        </Link>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Value</p>
                        <p className="font-semibold">{tx.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlockDetail;
