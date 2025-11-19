import { useRecentTransactions } from "@/hooks/useKeetaData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatKeetaAddress, formatKeetaAmount } from "@/lib/keetaOperations";
import { getTokenMetadata, getTokenSymbol } from "@/lib/tokenMetadata";
import { TrendingUp, Clock, Filter, Plus, X, Coins } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export default function Dex() {
  const { data: transactions, isLoading } = useRecentTransactions();
  const [timeFilter, setTimeFilter] = useState<'5m' | '1h' | '6h' | '24h'>('24h');
  const [filterTokens, setFilterTokens] = useState<string[]>([]);
  const [tokenInput, setTokenInput] = useState("");

  const tokenStats = useMemo(() => {
    // Initialize with all tokens from metadata
    const tokenMap = new Map<string, {
      token: string;
      txCount: number;
      volume: bigint;
      lastSeen: Date | null;
      addresses: Set<string>;
    }>();

    // Get all defined tokens
    const allDefinedTokens = [
      "keeta_aabiku5vlchcgsxqwj6o4sryvqucaywcb46advac425biaroqzhibaaj7mt6a6i", // BPACA
      "keeta_aabjew5wmckwg2vuccvu4h2gkildyrp2nlmdocebwfchxmhh7xb6g6y6rzvcxda", // PACA
      "keeta_aabsuldj4srhjx2rfgzf3b5c55i4vqoo2kmisbc62vd4qd2bmqkmu2mdr4l3zqi", // NDA
      "keeta_aabwqabactqc3s7lq4khxbpcze7cfux75iuixpevlfsrvwwf3ecdznegnn52m7q", // DRINK
      "keeta_aabwi6k5rislbhevld3frsfaso2d3v3t7u436clp5fqtsapppyjrzf4deuqyvdi", // AKTA
      "keeta_ao55q4okjv4hrbo7z7zl3hivrf64og3fpokup5hvt2wfejim5mxzxcykboc3w", // PACA (duplicate)
      "keeta_anin2xcn2ijmhezrmrzyoabztxc5kq43n3ftr4bziw2unvg46dvncqkbbpc72", // KCHAD
    ];

    // Initialize all tokens with zero values
    allDefinedTokens.forEach(token => {
      tokenMap.set(token, {
        token,
        txCount: 0,
        volume: 0n,
        lastSeen: null,
        addresses: new Set<string>()
      });
    });

    // Update with actual transaction data if available
    if (transactions) {
      transactions.forEach((tx: any) => {
        tx.operations?.forEach((op: any) => {
          if (op.type === 0 && op.token) { // Send operations
            const token = op.token;
            const existing = tokenMap.get(token);
            
            if (existing) {
              existing.txCount += 1;
              existing.volume += BigInt(op.amount || '0x0');
              existing.lastSeen = new Date(tx.date);
              existing.addresses.add(tx.account);
              if (op.to) existing.addresses.add(op.to);
            }
          }
        });
      });
    }

    const allTokens = Array.from(tokenMap.entries())
      .map(([token, stats]) => ({
        token,
        ...stats,
        addresses: stats.addresses.size,
        volumeFormatted: formatKeetaAmount(stats.volume.toString(16))
      }))
      .sort((a, b) => b.txCount - a.txCount);

    // Filter by selected tokens if any
    if (filterTokens.length > 0) {
      return allTokens.filter(t => filterTokens.includes(t.token));
    }

    return allTokens;
  }, [transactions, filterTokens]);

  const addToken = () => {
    const trimmed = tokenInput.trim();
    if (trimmed && !filterTokens.includes(trimmed)) {
      setFilterTokens([...filterTokens, trimmed]);
      setTokenInput("");
    }
  };

  const removeToken = (token: string) => {
    setFilterTokens(filterTokens.filter(t => t !== token));
  };

  const clearFilters = () => {
    setFilterTokens([]);
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading token data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Stats */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Token Explorer</h1>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span className="text-muted-foreground">Live Data</span>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-2 py-2 px-4">
              <TrendingUp className="w-4 h-4" />
              Trending
            </Badge>
            {['5m', '1h', '6h', '24h'].map((time) => (
              <Button
                key={time}
                variant={timeFilter === time ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter(time as any)}
              >
                {time.toUpperCase()}
              </Button>
            ))}
          </div>

          {/* Token Filter Input */}
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Paste token address to track (e.g., keeta_an...)"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addToken()}
                className="flex-1 font-mono text-sm"
              />
              <Button onClick={addToken} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Token
              </Button>
              {filterTokens.length > 0 && (
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Clear All
                </Button>
              )}
            </div>

            {/* Selected Tokens */}
            {filterTokens.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filterTokens.map((token) => {
                  const symbol = getTokenSymbol(token);
                  return (
                    <Badge key={token} variant="secondary" className="gap-2 py-1.5 px-3">
                      <span className="font-semibold text-xs">{symbol}</span>
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeToken(token)}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Token Table */}
      <div className="container mx-auto px-4 py-6">
        <Card className="border-border/50">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-semibold">#</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">TOKEN</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">AGE</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">TXNS</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">VOLUME</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">MAKERS</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">ACTIVITY</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      No token activity in recent transactions
                    </TableCell>
                  </TableRow>
                ) : (
                  tokenStats.map((stat, idx) => (
                    <TableRow 
                      key={stat.token}
                      className="border-border/30 hover:bg-accent/5 cursor-pointer transition-colors"
                    >
                      <TableCell className="text-muted-foreground">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {(() => {
                            const metadata = getTokenMetadata(stat.token);
                            return metadata?.imageUrl ? (
                              <img 
                                src={metadata.imageUrl} 
                                alt={metadata.symbol}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                <Coins className="w-4 h-4 text-primary" />
                              </div>
                            );
                          })()}
                          <div className="hidden w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Coins className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            {(() => {
                              const metadata = getTokenMetadata(stat.token);
                              return (
                                <>
                                  <div className="font-semibold text-foreground flex items-center gap-2">
                                    {metadata?.symbol || formatKeetaAddress(stat.token)}
                                    {metadata?.name && metadata.name !== metadata.symbol && (
                                      <span className="text-xs text-muted-foreground font-normal">
                                        {metadata.name}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground font-mono">
                                    {stat.token.slice(0, 15)}...
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {stat.lastSeen ? timeAgo(stat.lastSeen) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {stat.txCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {stat.volumeFormatted}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {stat.addresses}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant="outline" 
                          className={stat.txCount > 0 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted/50 text-muted-foreground border-border/50"}
                        >
                          {stat.txCount > 0 ? (
                            <>
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              No Activity
                            </>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
