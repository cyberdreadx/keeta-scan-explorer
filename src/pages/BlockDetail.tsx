import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Clock, ArrowRightLeft, User } from "lucide-react";

const BlockDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Box className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Block #{id}</h1>
          </div>
          <p className="text-muted-foreground">Block details and transactions</p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Box className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">Coming Soon</p>
              <p className="text-sm text-muted-foreground">
                Block details will be displayed here once connected to the network.
              </p>
            </div>
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlockDetail;
