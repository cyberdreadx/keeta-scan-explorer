import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRightLeft, Clock } from "lucide-react";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  status: "success" | "pending" | "failed";
}

const mockTransactions: Transaction[] = Array.from({ length: 10 }, (_, i) => ({
  hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
  from: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
  to: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
  value: (Math.random() * 100).toFixed(4),
  timestamp: `${Math.floor(Math.random() * 60)} secs ago`,
  status: Math.random() > 0.1 ? "success" : "pending",
}));

const LatestTransactions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-accent" />
          Latest Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <div
              key={tx.hash}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <ArrowRightLeft className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <Link
                    to={`/tx/${tx.hash}`}
                    className="font-mono text-sm text-primary hover:text-primary-glow transition-colors"
                  >
                    {tx.hash}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {tx.timestamp}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="text-muted-foreground">From</span>
                  <Link
                    to={`/address/${tx.from}`}
                    className="text-primary hover:text-primary-glow transition-colors font-mono"
                  >
                    {tx.from}
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">To</span>
                  <Link
                    to={`/address/${tx.to}`}
                    className="text-primary hover:text-primary-glow transition-colors font-mono"
                  >
                    {tx.to}
                  </Link>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={tx.status === "success" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {tx.status}
                  </Badge>
                  <span className="text-xs font-medium">{tx.value} KTA</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestTransactions;
