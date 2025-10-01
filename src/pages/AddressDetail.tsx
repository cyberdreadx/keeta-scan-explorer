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
      return (Number(amount) / 1e10).toFixed(4) + " KTA";
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
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="font-mono text-sm break-all">{address}</p>
              </div>

              {isLoading ? (
                <p className="text-muted-foreground">Loading account data...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                    <p className="text-2xl font-bold">{accountData?.totalTransactions || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge variant="default" className="mt-2">
                      {accountData?.totalTransactions ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              )}
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
              {isLoading ? (
                <p className="text-muted-foreground">Loading transactions...</p>
              ) : !accountData?.transactions || accountData.transactions.length === 0 ? (
                <p className="text-muted-foreground">No transactions found for this address.</p>
              ) : (
                <div className="space-y-3">
                  {accountData.transactions.map((block) => {
                    const isOutgoing = block.account === address;
                    const operation = block.operations?.[0];
                    const otherAddress = isOutgoing ? operation?.to : block.account;
                    
                    return (
                      <div
                        key={block.$hash || block.hash}
                        className="p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={isOutgoing ? "destructive" : "default"} className="text-xs">
                                {isOutgoing ? "OUT" : "IN"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(block.date)}
                              </span>
                            </div>
                            <Link
                              to={`/tx/${block.$hash || block.hash}`}
                              className="font-mono text-sm text-primary hover:text-primary-glow transition-colors"
                            >
                              {shortenHash(block.$hash || block.hash)}
                            </Link>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {isOutgoing ? "To" : "From"}
                            </p>
                            {otherAddress && (
                              <Link
                                to={`/address/${otherAddress}`}
                                className="font-mono text-primary hover:text-primary-glow transition-colors break-all text-xs"
                              >
                                {shortenHash(otherAddress)}
                              </Link>
                            )}
                          </div>
                          {operation?.amount && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Value</p>
                              <p className={`font-semibold ${isOutgoing ? 'text-destructive' : 'text-success'}`}>
                                {isOutgoing ? '-' : '+'}{formatAmount(operation.amount)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressDetail;
