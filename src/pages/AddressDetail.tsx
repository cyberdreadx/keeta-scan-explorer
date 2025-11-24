import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, ArrowRightLeft, ExternalLink } from "lucide-react";
import { useAccountInfo } from "@/hooks/useKeetaData";
import { getOperationType } from "@/lib/keetaOperations";
import { formatKeetaAmount } from "@/lib/keetaOperations";
import { getTokenMetadata } from "@/lib/tokenMetadata";

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
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-mono text-sm break-all">{address}</p>
                </div>
                
                {isLoading ? (
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground">Loading account info...</p>
                  </div>
                ) : accountData ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                    <p className="text-2xl font-bold">{accountData.totalTransactions || 0}</p>
                  </div>
                ) : (
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground">No account data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-accent" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading transactions...</p>
                </div>
              ) : accountData?.transactions && accountData.transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hash</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountData.transactions.map((tx: any) => {
                        const mainOp = tx.operations?.[0];
                        const opType = getOperationType(mainOp?.type || 0);
                        const token = mainOp?.token;
                        const metadata = getTokenMetadata(token);
                        const amount = mainOp?.amount ? formatKeetaAmount(mainOp.amount, token) : "0";
                        
                        return (
                          <TableRow key={tx.$hash || tx.hash}>
                            <TableCell>
                              <Link
                                to={`/transaction/${tx.$hash || tx.hash}`}
                                className="text-primary hover:underline font-mono text-xs flex items-center gap-1"
                              >
                                {shortenHash(tx.$hash || tx.hash)}
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {opType.name}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {metadata?.imageUrl && (
                                  <img src={metadata.imageUrl} alt={metadata.symbol} className="h-5 w-5 rounded-full" />
                                )}
                                <span className="font-semibold">
                                  {amount} {metadata?.symbol || 'KTA'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatTimestamp(tx.date)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions found</p>
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
