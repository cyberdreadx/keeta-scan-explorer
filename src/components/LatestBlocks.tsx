import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Box, Clock } from "lucide-react";
import { useRecentBlocks } from "@/hooks/useKeetaData";
import { formatDistanceToNow } from "date-fns";

const LatestBlocks = () => {
  const { data: blocks, isLoading } = useRecentBlocks();

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

  const getBlockHash = (b: { hash?: string; $hash?: string }) => b?.hash || b?.$hash || "";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="h-5 w-5 text-primary" />
          Latest Blocks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : !blocks || blocks.length === 0 ? (
          <div className="text-center py-12">
            <Box className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No blocks found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blocks.map((block) => {
              const hash = getBlockHash(block);
              return (
                <Link
                  key={hash}
                  to={`/block/${hash}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Box className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-medium">{shortenHash(hash)}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(block.date)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{block.operations?.length || 0} ops</Badge>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestBlocks;
