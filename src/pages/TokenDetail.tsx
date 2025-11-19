import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";

const TokenDetail = () => {
  const { address } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Token Details</h1>
          </div>
          <p className="text-muted-foreground">Token information and analytics</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">Token Address</p>
              <p className="font-mono text-sm break-all">{address}</p>
            </div>

            <div className="text-center py-12">
              <Coins className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">Coming Soon</p>
              <p className="text-sm text-muted-foreground">
                Token details and analytics will be displayed here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TokenDetail;
