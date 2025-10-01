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
          <div className="text-center py-8 text-muted-foreground">
            Loading blocks...
          </div>
        ) : blocks && blocks.length > 0 ? (
          <div className="space-y-3">
            {blocks.map((block) => (
              <div
                key={block.hash}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Box className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Link
                      to={`/block/${block.hash}`}
                      className="font-mono text-sm text-primary hover:text-primary-glow transition-colors"
                    >
                      {shortenHash(block.hash)}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(block.date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Link
                    to={`/address/${block.account}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
                  >
                    {shortenHash(block.account)}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {block.operations?.length || 0} ops
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No blocks found. The network may not have recent activity.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestBlocks;
