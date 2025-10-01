import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { Representative } from "@/lib/keetaService";

interface RepresentativesListProps {
  representatives: Representative[];
}

const RepresentativesList = ({ representatives }: RepresentativesListProps) => {
  const formatWeight = (hexWeight: string) => {
    try {
      const weight = BigInt(hexWeight);
      // Convert to a readable format
      return (weight / BigInt(1e15)).toString() + "P";
    } catch {
      return "0";
    }
  };

  const activeReps = representatives.filter(rep => rep.weight !== "0x0");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-success" />
          Network Representatives
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeReps.map((rep, index) => (
            <div
              key={rep.representative}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    Representative {index + 1}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono break-all max-w-[300px]">
                    {rep.representative}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="default" className="text-xs mb-1">
                  Active
                </Badge>
                <div className="text-xs text-muted-foreground">
                  Weight: {formatWeight(rep.weight)}
                </div>
              </div>
            </div>
          ))}
          {activeReps.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No active representatives found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RepresentativesList;
