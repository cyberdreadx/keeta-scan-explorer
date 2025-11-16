import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRightLeft, ArrowUpRight } from "lucide-react";
import { useRecentTransactions } from "@/hooks/useKeetaData";
import { formatDistanceToNow } from "date-fns";

const RecentActivity = () => {
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
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 4)}`;
  };

  const shortenAddress = (address: string) => {
    if (!address) return "N/A";
    return `${address.substring(0, 12)}...${address.substring(address.length - 6)}`;
  };

  const formatAmount = (hexAmount: string) => {
    try {
      const amount = parseInt(hexAmount, 16) / 1e8;
      return amount.toFixed(3);
    } catch {
      return "0";
    }
  };

  const getOperationBadge = (type: number) => {
    switch (type) {
      case 0:
        return <Badge variant="destructive" className="text-xs">Send</Badge>;
      case 1:
        return <Badge variant="default" className="text-xs bg-green-600">Receive</Badge>;
      case 2:
        return <Badge variant="secondary" className="text-xs">Fee</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  const getOperationDescription = (tx: any) => {
    const operations = tx.operations || [];
    if (operations.length === 0) return "Transaction";
    
    const firstOp = operations[0];
    const amount = formatAmount(firstOp.amount || "0x0");
    
    if (firstOp.type === 0) {
      return `Send ${amount} KTA`;
    } else if (firstOp.type === 1) {
      return `Receive ${amount} KTA`;
    } else {
      return `${amount} KTA`;
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <Link to="/explorer" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="text-center py-12">
            <ArrowRightLeft className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Block Hash</th>
                  <th className="pb-3 font-medium">Account</th>
                  <th className="pb-3 font-medium">Operations</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium text-right">To</th>
                  <th className="pb-3 font-medium text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.slice(0, 15).map((tx) => {
                  const hash = tx.hash || tx.$hash || "";
                  const operations = tx.operations || [];
                  const firstOp = operations[0] || {};
                  
                  return (
                    <tr key={hash} className="hover:bg-accent/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {getOperationDescription(tx)}
                          </span>
                        </div>
                        <Link
                          to={`/block/${hash}`}
                          className="font-mono text-xs text-primary hover:underline"
                        >
                          {shortenHash(hash)}
                        </Link>
                      </td>
                      <td className="py-3">
                        <Link
                          to={`/address/${tx.account}`}
                          className="font-mono text-xs text-foreground hover:text-primary transition-colors"
                        >
                          {shortenAddress(tx.account)}
                        </Link>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          {operations.map((op: any, idx: number) => (
                            <div key={idx}>
                              {getOperationBadge(op.type)}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-mono text-sm font-medium">
                          {formatAmount(firstOp.amount || "0x0")} KTA
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {firstOp.to ? (
                          <Link
                            to={`/address/${firstOp.to}`}
                            className="font-mono text-xs text-foreground hover:text-primary transition-colors"
                          >
                            {shortenAddress(firstOp.to)}
                          </Link>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(tx.date)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
