import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getTokenMetadata } from "@/lib/tokenMetadata";
import { useTokenStatistics } from "@/hooks/useTokenStatistics";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";
import { formatKeetaAmount } from "@/lib/keetaOperations";

interface TokenRowProps {
  token: string;
  rank: number;
  onClick?: () => void;
}

export function TokenRow({ token, rank, onClick }: TokenRowProps) {
  const { data: stats, isLoading, error } = useTokenStatistics(token);
  const metadata = getTokenMetadata(token);

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num >= 1000) return num.toFixed(0);
    if (num >= 1) return num.toFixed(2);
    if (num >= 0.01) return num.toFixed(4);
    return num.toFixed(8);
  };

  const formatVolume = (volume: string) => {
    try {
      const num = BigInt(volume);
      const divisor = BigInt("1000000000000000000"); // 18 decimals
      const whole = num / divisor;
      
      // Format with commas
      return whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (error) {
      console.error('Error formatting volume:', error);
      return '0';
    }
  };

  const priceChange = stats?.priceChange24h || 0;
  const isPositive = priceChange >= 0;
  
  // Check if data is unavailable (404 or other error after loading)
  const hasNoData = !isLoading && !stats;

  return (
    <TableRow 
      className="border-border/30 hover:bg-accent/5 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <TableCell className="text-muted-foreground">{rank}</TableCell>
      
      <TableCell>
        <div className="flex items-center gap-3">
          {metadata?.imageUrl ? (
            <img 
              src={metadata.imageUrl} 
              alt={metadata.symbol}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Coins className="w-4 h-4 text-primary" />
            </div>
          )}
          <div className="hidden w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center">
            <Coins className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-semibold text-foreground flex items-center gap-2">
              {metadata?.symbol || token.slice(0, 10)}
              {metadata?.name && metadata.name !== metadata.symbol && (
                <span className="text-xs text-muted-foreground font-normal">
                  {metadata.name}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {token.slice(0, 15)}...
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-right">
        {isLoading ? (
          <span className="text-muted-foreground text-sm">Loading...</span>
        ) : hasNoData ? (
          <span className="text-muted-foreground text-sm">No data</span>
        ) : (
          <div>
            <div className="font-semibold text-foreground">
              {formatPrice(stats.currentPrice)} KTA
            </div>
            <div className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              ${formatPrice(stats.currentPrice)}
            </div>
          </div>
        )}
      </TableCell>

      <TableCell className="text-right">
        {isLoading ? (
          <span className="text-muted-foreground text-sm">-</span>
        ) : hasNoData ? (
          <span className="text-muted-foreground text-sm">-</span>
        ) : (
          <div className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center justify-end gap-1`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        )}
      </TableCell>

      <TableCell className="text-right font-semibold text-foreground">
        {isLoading ? (
          <span className="text-muted-foreground text-sm">-</span>
        ) : hasNoData ? (
          <span className="text-muted-foreground text-sm">-</span>
        ) : (
          formatVolume(stats.volume24h)
        )}
      </TableCell>

      <TableCell className="text-right font-semibold text-foreground">
        {isLoading ? (
          <span className="text-muted-foreground text-sm">-</span>
        ) : hasNoData ? (
          <span className="text-muted-foreground text-sm">-</span>
        ) : (
          parseInt(stats.holders).toLocaleString()
        )}
      </TableCell>

      <TableCell className="text-right">
        {isLoading ? (
          <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border/50">
            Loading...
          </Badge>
        ) : hasNoData ? (
          <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border/50">
            No Data
          </Badge>
        ) : (
          <Badge 
            variant="outline" 
            className="bg-green-500/10 text-green-500 border-green-500/20"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
}
