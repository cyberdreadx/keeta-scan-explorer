import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, CheckCircle2, Clock } from "lucide-react";

const TransactionDetail = () => {
  const { hash } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <ArrowRightLeft className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold">Transaction Details</h1>
          </div>
          <p className="text-muted-foreground">Information about this transaction</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
              <p className="font-mono text-sm break-all">{hash}</p>
            </div>

            <div className="text-center py-12">
              <ArrowRightLeft className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">Coming Soon</p>
              <p className="text-sm text-muted-foreground">
                Transaction details will be displayed here once connected to the network.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetail;
