import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, ExternalLink, Coins, Anchor, Clock, CheckCircle2, Copy } from "lucide-react";
import { useTransactionDetail } from "@/hooks/useTransactionDetail";
import { getOperationType, formatKeetaAddress, formatKeetaAmount, isAtomicSwap, getSwapAmounts } from "@/lib/keetaOperations";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";

const TransactionDetail = () => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const { data: transaction, isLoading } = useTransactionDetail(hash);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Hash copied successfully",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <ArrowRightLeft className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">Transaction Not Found</p>
              <p className="text-sm text-muted-foreground mb-4">
                The transaction with hash {hash} could not be found.
              </p>
              <button
                onClick={() => navigate('/transactions')}
                className="text-primary hover:text-primary/80"
              >
                View all transactions →
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isSwap = isAtomicSwap(transaction.operations);
  const swapAmounts = isSwap ? getSwapAmounts(transaction.operations) : null;
  const txHash = transaction.$hash || transaction.hash;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            {isSwap ? (
              <ArrowRightLeft className="h-8 w-8 text-blue-500" />
            ) : (
              transaction.operations?.[0] && (() => {
                const opType = getOperationType(transaction.operations[0].type);
                const OpIcon = opType.icon;
                return <OpIcon className="h-8 w-8" style={{ color: opType.color }} />;
              })()
            )}
            <h1 className="text-3xl font-bold">
              {isSwap ? 'Atomic Swap Details' : 'Transaction Details'}
            </h1>
          </div>
          <p className="text-muted-foreground">Complete information about this transaction</p>
        </div>

        {/* Transaction Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Transaction Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Hash */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm break-all">{txHash}</p>
                <button
                  onClick={() => copyToClipboard(txHash)}
                  className="text-primary hover:text-primary/80"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                  Confirmed
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <Badge variant="secondary">
                  {isSwap ? 'Atomic Swap' : (transaction.purpose === 1 ? 'Admin Transaction' : 'Standard Transaction')}
                </Badge>
              </div>
            </div>

            {/* Timestamp */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{new Date(transaction.date).toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatDistanceToNow(new Date(transaction.date), { addSuffix: true })})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* From Account */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">From</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{formatKeetaAddress(transaction.account)}</span>
                <button
                  onClick={() => navigate(`/address/${transaction.account}`)}
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Previous Block */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Previous Block</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{formatKeetaAddress(transaction.previous)}</span>
                <button
                  onClick={() => navigate(`/block/${transaction.previous}`)}
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Network */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Network</p>
              <span className="text-sm font-mono">{transaction.network || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Operations */}
        <Card>
          <CardHeader>
            <CardTitle>Operations ({transaction.operations?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transaction.operations?.map((op: any, idx: number) => {
                const opType = getOperationType(op.type);
                const OpIcon = opType.icon;

                return (
                  <Card key={idx} className="bg-background/50 border-border/50">
                    <CardContent className="p-4 space-y-3">
                      {/* Operation Type */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <OpIcon className="h-5 w-5" style={{ color: opType.color }} />
                          <Badge
                            variant="secondary"
                            className="border"
                            style={{ 
                              backgroundColor: `${opType.color}20`,
                              color: opType.color,
                              borderColor: `${opType.color}30`
                            }}
                          >
                            {opType.name}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">Operation {idx + 1}</span>
                      </div>

                      {/* Amount */}
                      {op.amount && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Amount</p>
                          <p className="text-lg font-semibold text-foreground">
                            {formatKeetaAmount(op.amount)} KTA
                          </p>
                        </div>
                      )}

                      {/* To Address */}
                      {op.to && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">To</p>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{formatKeetaAddress(op.to)}</span>
                            <button
                              onClick={() => navigate(`/address/${op.to}`)}
                              className="text-primary hover:text-primary/80"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Token */}
                      {op.token && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Token</p>
                          <span className="font-mono text-sm">{formatKeetaAddress(op.token)}</span>
                        </div>
                      )}

                      {/* From Address (for swaps) */}
                      {op.from && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">From</p>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{formatKeetaAddress(op.from)}</span>
                            <button
                              onClick={() => navigate(`/address/${op.from}`)}
                              className="text-primary hover:text-primary/80"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Exact flag for swaps */}
                      {op.exact !== undefined && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Exact Amount</p>
                          <Badge variant={op.exact ? "default" : "secondary"}>
                            {op.exact ? "Yes" : "No"}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetail;
