import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRightLeft, Clock } from "lucide-react";
import { useRecentTransactions } from "@/hooks/useKeetaData";
import { formatDistanceToNow } from "date-fns";

const LatestTransactions = () => {
  const { data: transactions, isLoading } = useRecentTransactions();

  const formatTimestamp = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const shortenHash = (hash: string) => {
    if (!hash) return "N/A";
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 6)}`;
  };

  const getOperationType = (operations: any[]) => {
    if (!operations || operations.length === 0) return "Unknown";
    return operations[0].type || "Transaction";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-accent" />
          Latest Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="text-center py-12">
            <ArrowRightLeft className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const hash = tx.hash || tx.$hash || "";
              return (
                <Link
                  key={hash}
                  to={`/transaction/${hash}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <ArrowRightLeft className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-medium">{shortenHash(hash)}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(tx.date)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{getOperationType(tx.operations)}</Badge>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestTransactions;
