import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface LiveIndicatorProps {
  lastUpdated?: number;
  isLive?: boolean;
}

export const LiveIndicator = ({ lastUpdated, isLive = true }: LiveIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      {isLive && (
        <Badge variant="outline" className="border-green-500 text-green-500">
          <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
          Live
        </Badge>
      )}
      {lastUpdated && (
        <span className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
        </span>
      )}
    </div>
  );
};
