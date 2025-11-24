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
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-mono text-sm break-all">{address}</p>
                </div>
                
                {isLoading ? (
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground">Loading account info...</p>
                  </div>
                ) : accountData ? (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Keeta Balance</p>
                      <p className="text-3xl font-bold">
                        {accountData.balances?.['keeta_ansab4br7emzyatxqymuzva7zub6b3fawwqhmxwjygnvpyqqqrxhcsle2upqw'] 
                          ? formatKeetaAmount(accountData.balances['keeta_ansab4br7emzyatxqymuzva7zub6b3fawwqhmxwjygnvpyqqqrxhcsle2upqw'], 'keeta_ansab4br7emzyatxqymuzva7zub6b3fawwqhmxwjygnvpyqqqrxhcsle2upqw')
                          : '0'} KTA
                      </p>
                    </div>

                    {accountData.balances && Object.keys(accountData.balances).length > 1 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">Other Tokens</p>
                        <div className="space-y-2">
                          {Object.entries(accountData.balances)
                            .filter(([token]) => token !== 'keeta_ansab4br7emzyatxqymuzva7zub6b3fawwqhmxwjygnvpyqqqrxhcsle2upqw')
                            .map(([token, balance]) => {
                              const metadata = getTokenMetadata(token);
                              const amount = formatKeetaAmount(balance as string, token);
                              
                              return (
                                <Link
                                  key={token}
                                  to={`/token/${token}`}
                                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    {metadata?.imageUrl && (
                                      <img src={metadata.imageUrl} alt={metadata.symbol} className="h-8 w-8 rounded-full" />
                                    )}
                                    <div>
                                      <p className="font-semibold">{metadata?.name || 'Unknown Token'}</p>
                                      <p className="text-xs text-muted-foreground font-mono">
                                        {token.substring(0, 10)}...{token.substring(token.length - 6)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">{amount} {metadata?.symbol || 'UNKNOWN'}</p>
                                  </div>
                                </Link>
                              );
                            })}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                      <p className="text-2xl font-bold">{accountData.totalTransactions || 0}</p>
                    </div>
                  </>
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
                        <TableHead>Block</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountData.transactions.map((tx: any) => {
                        // Determine if this is a swap (has both Send and Conditional Receive)
                        const operations = tx.operations || [];
                        const hasSend = operations.some((op: any) => op.type === 0);
                        const hasConditionalReceive = operations.some((op: any) => op.type === 7);
                        const isSwap = hasSend && hasConditionalReceive;
                        
                        let transactionType = 'SEND';
                        let fromAddress = tx.account;
                        let toAddress = '';
                        let displayAmount = '';
                        
                        if (isSwap) {
                          // SWAP transaction
                          transactionType = 'SWAP';
                          const sendOp = operations.find((op: any) => op.type === 0);
                          const receiveOp = operations.find((op: any) => op.type === 7);
                          
                          if (sendOp && receiveOp) {
                            const sendToken = sendOp.token || 'keeta_ansab4br7emzyatxqymuzva7zub6b3fawwqhmxwjygnvpyqqqrxhcsle2upqw';
                            const receiveToken = receiveOp.token || 'keeta_ansab4br7emzyatxqymuzva7zub6b3fawwqhmxwjygnvpyqqqrxhcsle2upqw';
                            const sendMetadata = getTokenMetadata(sendToken);
                            const receiveMetadata = getTokenMetadata(receiveToken);
                            const sendAmount = formatKeetaAmount(sendOp.amount || '0x0', sendToken);
                            const receiveAmount = formatKeetaAmount(receiveOp.amount || '0x0', receiveToken);
                            
                            fromAddress = tx.account;
                            toAddress = receiveOp.from || sendOp.to || '';
                            displayAmount = `${sendAmount} ${sendMetadata?.symbol || 'KTA'} ⇄ ${receiveAmount} ${receiveMetadata?.symbol || 'MURF'}`;
                          }
                        } else if (tx.account === address) {
                          // Transaction FROM this address
                          transactionType = 'SEND';
                          const sendOp = operations.find((op: any) => op.type === 0);
                          if (sendOp) {
                            toAddress = sendOp.to;
                            const token = sendOp.token || 'keeta_ansab4br7emzyatxqymuzva7zub6b3fawwqhmxwjygnvpyqqqrxhcsle2upqw';
                            const metadata = getTokenMetadata(token);
                            const amount = formatKeetaAmount(sendOp.amount || '0x0', token);
                            displayAmount = `${amount} ${metadata?.symbol || 'KTA'}`;
                          }
                        } else {
                          // Transaction TO this address
                          transactionType = 'RECEIVE';
                          const receiveOp = operations.find((op: any) => op.to === address || op.type === 1);
                          if (receiveOp) {
                            fromAddress = tx.account;
                            toAddress = address || '';
                            const token = receiveOp.token || 'keeta_ansab4br7emzyatxqymuzva7zub6b3fawwqhmxwjygnvpyqqqrxhcsle2upqw';
                            const metadata = getTokenMetadata(token);
                            const amount = formatKeetaAmount(receiveOp.amount || '0x0', token);
                            displayAmount = `${amount} ${metadata?.symbol || 'KTA'}`;
                          }
                        }
                        
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
                            <TableCell className="text-xs text-muted-foreground">
                              {formatTimestamp(tx.date)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {transactionType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Link
                                to={`/address/${fromAddress}`}
                                className="text-primary hover:underline font-mono text-xs"
                              >
                                {shortenHash(fromAddress)}
                              </Link>
                            </TableCell>
                            <TableCell>
                              {toAddress && (
                                <Link
                                  to={`/address/${toAddress}`}
                                  className="text-primary hover:underline font-mono text-xs"
                                >
                                  {shortenHash(toAddress)}
                                </Link>
                              )}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {displayAmount}
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
