import { useParams, useNavigate } from "react-router-dom";
import { useAccountInfo } from "@/hooks/useKeetaData";
import { useTokenStatistics } from "@/hooks/useTokenStatistics";
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
import { getTokenMetadata } from "@/lib/tokenMetadata";
import { formatKeetaAddress, formatKeetaAmount } from "@/lib/keetaOperations";
import { ArrowLeft, Copy, ExternalLink, TrendingUp, TrendingDown, Coins } from "lucide-react";
import { toast } from "sonner";

export default function TokenDetail() {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const { data: accountInfo, isLoading: accountLoading } = useAccountInfo(address);
  const { data: stats, isLoading: statsLoading } = useTokenStatistics(address || "");
  
  const metadata = address ? getTokenMetadata(address) : null;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard");
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Invalid token address</p>
      </div>
    );
  }

  const priceChange = stats?.priceChange24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dex")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tokens
          </Button>

          <div className="flex items-start gap-4">
            {metadata?.imageUrl ? (
              <img 
                src={metadata.imageUrl} 
                alt={metadata.symbol}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Coins className="w-8 h-8 text-primary" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {metadata?.symbol || formatKeetaAddress(address)}
                </h1>
                {metadata?.name && metadata.name !== metadata.symbol && (
                  <span className="text-lg text-muted-foreground">{metadata.name}</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mb-4">
                <span>{address}</span>
                <button onClick={copyAddress} className="hover:text-foreground transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`https://explorer.keeta.com/account/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {accountLoading ? (
                <p className="text-sm text-muted-foreground">Loading balance...</p>
              ) : accountInfo ? (
                <div className="text-2xl font-semibold">
                  Account Type: {accountInfo.address ? 'ACTIVE' : 'UNKNOWN'}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Price</div>
            {statsLoading ? (
              <div className="text-xl font-bold text-muted-foreground">Loading...</div>
            ) : stats ? (
              <>
                <div className="text-2xl font-bold">{parseFloat(stats.currentPrice).toFixed(2)} KTA</div>
                <div className="text-sm text-muted-foreground mt-1">
                  ${parseFloat(stats.currentPrice).toFixed(2)}
                </div>
              </>
            ) : (
              <div className="text-xl font-bold text-muted-foreground">No data</div>
            )}
          </Card>

          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">24h Change</div>
            {statsLoading ? (
              <div className="text-xl font-bold text-muted-foreground">Loading...</div>
            ) : stats ? (
              <div className={`text-2xl font-bold flex items-center gap-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
            ) : (
              <div className="text-xl font-bold text-muted-foreground">No data</div>
            )}
          </Card>

          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">24h Volume</div>
            {statsLoading ? (
              <div className="text-xl font-bold text-muted-foreground">Loading...</div>
            ) : stats ? (
              <div className="text-2xl font-bold">
                {formatKeetaAmount(`0x${BigInt(stats.volume24h).toString(16)}`)}
              </div>
            ) : (
              <div className="text-xl font-bold text-muted-foreground">No data</div>
            )}
          </Card>

          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Holders</div>
            {statsLoading ? (
              <div className="text-xl font-bold text-muted-foreground">Loading...</div>
            ) : stats ? (
              <div className="text-2xl font-bold">{parseInt(stats.holders).toLocaleString()}</div>
            ) : (
              <div className="text-xl font-bold text-muted-foreground">No data</div>
            )}
          </Card>
        </div>

        {/* Additional Stats */}
        {stats && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Token Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Supply</div>
                <div className="text-lg font-semibold">
                  {formatKeetaAmount(`0x${BigInt(stats.totalSupply).toString(16)}`)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Circulating Supply</div>
                <div className="text-lg font-semibold">
                  {formatKeetaAmount(`0x${BigInt(stats.circulatingSupply).toString(16)}`)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Volume</div>
                <div className="text-lg font-semibold">
                  {formatKeetaAmount(`0x${BigInt(stats.volumeTotal).toString(16)}`)}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Transaction History */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          {accountLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading transactions...</p>
          ) : accountInfo?.transactions && accountInfo.transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Block</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountInfo.transactions.slice(0, 10).map((tx: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-sm">
                        {(tx.hash || tx.$hash || '').slice(0, 8)}...
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(tx.date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.type || 'UNKNOWN'}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {tx.from ? formatKeetaAddress(tx.from) : '-'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {tx.to ? formatKeetaAddress(tx.to) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {tx.amount ? formatKeetaAmount(tx.amount) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No recent transactions</p>
          )}
        </Card>
      </div>
    </div>
  );
}
