import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBaseAnchor } from "@/hooks/useKeetaData";
import { Anchor } from "lucide-react";

const BaseAnchor = () => {
  const { data: baseAnchor, isLoading } = useBaseAnchor();

  if (isLoading) {
    return (
      <div className="w-full max-w-[100vw] overflow-x-hidden p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Anchor className="h-8 w-8" />
          Base Anchor
        </h1>
        <p className="text-muted-foreground">
          Current base anchor block on the Keeta network
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Base Anchor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Block Hash</p>
              <p className="font-mono text-sm break-all">{baseAnchor?.hash || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Block Height</p>
              <p className="text-lg font-semibold">{baseAnchor?.height?.toLocaleString() || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
              <p className="text-sm">
                {baseAnchor?.timestamp 
                  ? new Date(baseAnchor.timestamp * 1000).toLocaleString()
                  : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BaseAnchor;
