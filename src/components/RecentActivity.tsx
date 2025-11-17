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
      const amount = parseInt(hexAmount, 16) / 1e18;
      return amount.toFixed(3);
    } catch {
      return "0";
    }
  };

  const getOperationBadge = (type: number) => {
    switch (type) {
      case 0:
        return <Badge variant="destructive" className="text-[10px] px-2 py-0.5">Send</Badge>;
      case 1:
        return <Badge className="text-[10px] px-2 py-0.5 bg-blue-600 hover:bg-blue-700">Receive</Badge>;
      case 2:
        return <Badge variant="secondary" className="text-[10px] px-2 py-0.5">Fee</Badge>;
      case 7:
        return <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30">Admin Supply</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] px-2 py-0.5">Unknown</Badge>;
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
    <Card className="col-span-full border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">
            Recent Activity
          </CardTitle>
          <Link to="/explorer" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
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
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                  <th className="pb-3 pl-4">Block Hash</th>
                  <th className="pb-3">Account</th>
                  <th className="pb-3">Operations</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right pr-4">To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {transactions.slice(0, 15).map((tx) => {
                  const hash = tx.hash || tx.$hash || "";
                  const operations = tx.operations || [];
                  const firstOp = operations[0] || {};
                  
                  return (
                    <tr key={hash} className="hover:bg-muted/20 transition-colors group">
                      <td className="py-4 pl-4">
                        <div className="flex flex-col gap-1">
                          <Link
                            to={`/block/${hash}`}
                            className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                          >
                            {shortenHash(hash)}
                            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </div>
                      </td>
                      <td className="py-4">
                        <Link
                          to={`/address/${tx.account}`}
                          className="font-mono text-xs text-foreground/80 hover:text-primary transition-colors flex items-center gap-1"
                        >
                          {shortenAddress(tx.account)}
                          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-1 flex-wrap">
                          {operations.length > 1 && (
                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                              {operations.length}x {getOperationBadge(operations[0].type).props.children}
                            </Badge>
                          )}
                          {operations.length === 1 && getOperationBadge(operations[0].type)}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className="font-mono text-sm font-medium text-foreground">
                          {formatAmount(firstOp.amount || "0x0")} KTA
                        </span>
                      </td>
                      <td className="py-4 text-right pr-4">
                        {firstOp.to ? (
                          <Link
                            to={`/address/${firstOp.to}`}
                            className="font-mono text-xs text-foreground/80 hover:text-primary transition-colors inline-flex items-center gap-1"
                          >
                            {shortenAddress(firstOp.to)}
                            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ) : operations.length > 1 ? (
                          <span className="text-xs text-muted-foreground">{operations.length} accounts</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
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
