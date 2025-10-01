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
          <div className="text-center py-8 text-muted-foreground">
            Loading transactions...
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx) => (
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
                      {shortenHash(tx.hash)}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(tx.date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Link
                    to={`/address/${tx.account}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono mb-1 block"
                  >
                    {shortenHash(tx.account)}
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="default" className="text-xs">
                      {getOperationType(tx.operations)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {tx.operations?.length || 0} ops
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found. The network may not have recent activity.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestTransactions;
