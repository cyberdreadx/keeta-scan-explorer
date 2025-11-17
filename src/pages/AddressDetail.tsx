import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowRightLeft } from "lucide-react";
import { useAccountInfo } from "@/hooks/useKeetaData";

const AddressDetail = () => {
  const { address } = useParams();
  const { data: accountData, isLoading } = useAccountInfo(address);

  const shortenHash = (hash: string) => {
    if (!hash) return "";
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const formatTimestamp = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (hexAmount: string) => {
    try {
      const amount = BigInt(hexAmount);
      return (Number(amount) / 1e18).toFixed(4) + " KTA";
    } catch {
      return "0 KTA";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Address</h1>
          </div>
          <p className="text-muted-foreground">Address details and transaction history</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="font-mono text-sm break-all">{address}</p>
              </div>

              <div className="text-center py-12 mt-6">
                <Wallet className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">Coming Soon</p>
                <p className="text-sm text-muted-foreground">
                  Address details and transactions will be displayed here once connected to the network.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-accent" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Transaction history coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressDetail;
