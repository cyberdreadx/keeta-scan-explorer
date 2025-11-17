import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBaseAnchor, useRecentBlocks } from "@/hooks/useKeetaData";
import { Anchor } from "lucide-react";
import { Link } from "react-router-dom";
import { getOperationType } from "@/lib/keetaOperations";

const BaseAnchor = () => {
  const { data: baseAnchor, isLoading } = useBaseAnchor();
  const { data: recentBlocks = [] } = useRecentBlocks();

  // Filter blocks matching the base anchor hash
  const baseAnchorBlocks = recentBlocks.filter(
    (block: any) => (block.hash || block.$hash) === baseAnchor?.hash
  );

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

        {baseAnchorBlocks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Base Anchor Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hash</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Operations</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {baseAnchorBlocks.map((block: any) => (
                      <TableRow key={block.hash || block.$hash}>
                        <TableCell>
                          <Link
                            to={`/tx/${block.hash || block.$hash}`}
                            className="text-primary hover:underline font-mono text-xs"
                          >
                            {(block.hash || block.$hash)?.substring(0, 16)}...
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/address/${block.account}`}
                            className="text-primary hover:underline font-mono text-xs"
                          >
                            {block.account?.substring(0, 16)}...
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {block.operations?.map((op: any, idx: number) => (
                              <span key={idx} className="text-xs">
                                {getOperationType(op.type).name}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(block.date).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BaseAnchor;
