import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Box, Clock } from "lucide-react";

interface Block {
  number: number;
  timestamp: string;
  transactions: number;
  miner: string;
  reward: string;
}

const mockBlocks: Block[] = Array.from({ length: 10 }, (_, i) => ({
  number: 1234567 - i,
  timestamp: `${Math.floor(Math.random() * 60)} secs ago`,
  transactions: Math.floor(Math.random() * 200) + 50,
  miner: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
  reward: (Math.random() * 2 + 1).toFixed(4),
}));

const LatestBlocks = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="h-5 w-5 text-primary" />
          Latest Blocks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockBlocks.map((block) => (
            <div
              key={block.number}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Box className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Link
                    to={`/block/${block.number}`}
                    className="font-semibold text-primary hover:text-primary-glow transition-colors"
                  >
                    {block.number}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {block.timestamp}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Link
                  to={`/address/${block.miner}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {block.miner}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {block.transactions} txns
                  </Badge>
                  <span className="text-xs font-medium text-success">
                    {block.reward} KTA
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestBlocks;
