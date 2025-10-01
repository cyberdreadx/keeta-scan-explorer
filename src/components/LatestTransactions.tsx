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
        <div className="text-center py-12">
          <ArrowRightLeft className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">Coming Soon</p>
          <p className="text-sm text-muted-foreground">
            Latest transactions will be displayed here once connected to the network.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestTransactions;
