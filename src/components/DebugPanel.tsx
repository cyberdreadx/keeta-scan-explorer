import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, ChevronDown, ChevronUp } from "lucide-react";
import { keetaService } from "@/lib/keetaService";

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugData = async () => {
    setLoading(true);
    try {
      const [reps, blocks, txs] = await Promise.all([
        keetaService.getRepresentatives(),
        keetaService.getRecentBlocks(),
        keetaService.getRecentTransactions(),
      ]);

      setData({
        representatives: reps,
        blocks: blocks,
        transactions: txs,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Debug fetch error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-accent" />
              Debug Panel
              <Badge variant="secondary" className="text-xs">
                API Data
              </Badge>
            </div>
            {isOpen ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </CardTitle>
        </CardHeader>
        {isOpen && (
          <CardContent className="space-y-4">
            <Button
              onClick={fetchDebugData}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Fetching..." : "Fetch Latest Data"}
            </Button>

            {data && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-1">Representatives:</p>
                  <Badge variant="outline">{data.representatives?.length || 0} found</Badge>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-1">Blocks:</p>
                  <Badge variant="outline">{data.blocks?.length || 0} found</Badge>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-1">Transactions:</p>
                  <Badge variant="outline">{data.transactions?.length || 0} found</Badge>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    Raw Data (check browser console for full logs):
                  </p>
                  <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Open browser console (F12) to see detailed logs
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default DebugPanel;
