import { useRecentTransactions } from "@/hooks/useKeetaData";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ExternalLink, Coins, Anchor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getOperationType, formatKeetaAddress, formatKeetaAmount } from "@/lib/keetaOperations";

export const RecentActivity = () => {
  const { data: transactions, isLoading } = useRecentTransactions();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-foreground">Recent Activity</h2>
          <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
            View all →
          </button>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-card/50 animate-pulse">
              <div className="p-6 space-y-4">
                <div className="h-6 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-foreground">Recent Activity</h2>
        </div>
        <Card className="bg-card/50 border-border">
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No recent transactions</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-foreground">Recent Activity</h2>
        <button 
          onClick={() => navigate('/transactions')}
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
        >
          View all →
        </button>
      </div>

      <div className="space-y-4">
        {transactions.slice(0, 10).map((tx: any) => {
          const hash = tx.$hash || tx.hash || "N/A";
          
          return (
            <Card 
              key={hash} 
              className="bg-card/50 border-border hover:bg-card/70 transition-colors cursor-pointer"
              onClick={() => navigate(`/transaction/${hash}`)}
            >
              <div className="p-6 space-y-4">
                {/* Transaction Title */}
                <div className="flex items-center gap-2 mb-3">
                  {tx.operations?.[0] && (() => {
                    const opType = getOperationType(tx.operations[0].type);
                    const OpIcon = opType.icon;
                    return <OpIcon className="w-5 h-5" style={{ color: opType.color }} />;
                  })()}
                  <h3 className="text-lg font-semibold text-foreground">
                    {tx.purpose === 1 ? 'Admin Transaction' : 'Transaction'}
                  </h3>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {new Date(tx.date).toLocaleString()}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {tx.operations?.[0]?.amount && formatKeetaAmount(tx.operations[0].amount)} KTA to {formatKeetaAddress(tx.operations[0].to || tx.account)}
                </p>

                {/* Inner card with details */}
                <Card className="bg-background/50 border-border/50">
                  <div className="p-4 space-y-3">
                    {/* Hash with link */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-mono text-foreground">
                        {formatKeetaAddress(hash, 8)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/transaction/${hash}`);
                        }}
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <span className="text-muted-foreground">by</span>
                      {tx.purpose === 1 ? (
                        <>
                          <Anchor className="w-4 h-4 text-blue-500" />
                          <span className="text-foreground">Base Anchor</span>
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4 text-amber-500" />
                          <span className="text-foreground">KTA</span>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/address/${tx.account}`);
                        }}
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Operations badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">Operations</span>
                      {tx.operations?.map((op: any, idx: number) => {
                        const opType = getOperationType(op.type);
                        return (
                          <Badge 
                            key={idx}
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
                        );
                      })}
                      <span className="text-sm text-muted-foreground ml-auto">Amount</span>
                      <span className="text-sm font-semibold text-foreground">
                        {tx.operations?.[0]?.amount && formatKeetaAmount(tx.operations[0].amount)} KTA
                      </span>
                    </div>

                    {/* To section */}
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">To</span>
                      <div className="flex items-center gap-2">
                        {tx.purpose === 1 ? (
                          <>
                            <Anchor className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-foreground">
                              {formatKeetaAddress(tx.operations?.[0]?.to || tx.account)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-foreground font-mono">
                            {formatKeetaAddress(tx.operations?.[0]?.to || tx.account)}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const toAddress = tx.operations?.[0]?.to || tx.account;
                            navigate(`/address/${toAddress}`);
                          }}
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
