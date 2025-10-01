import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowRightLeft } from "lucide-react";

const AddressDetail = () => {
  const { address } = useParams();

  // Mock data
  const addressData = {
    address: address || "",
    balance: "1,234.5678 KTA",
    valueUSD: "$12,345.67",
    transactions: "156",
  };

  const transactions = Array.from({ length: 10 }, (_, i) => ({
    hash: "0x" + Math.random().toString(16).substring(2, 66),
    from: Math.random() > 0.5 ? addressData.address : "0x" + Math.random().toString(16).substring(2, 42),
    to: Math.random() > 0.5 ? addressData.address : "0x" + Math.random().toString(16).substring(2, 42),
    value: (Math.random() * 100).toFixed(4) + " KTA",
    timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
    status: "success" as const,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Address</h1>
          </div>
          <p className="text-muted-foreground">Address details and transaction history</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="font-mono text-sm break-all">{addressData.address}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Balance</p>
                  <p className="text-2xl font-bold">{addressData.balance}</p>
                  <p className="text-sm text-muted-foreground">{addressData.valueUSD}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                  <p className="text-2xl font-bold">{addressData.transactions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge variant="default" className="mt-2">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-accent" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((tx) => {
                  const isOutgoing = tx.from === addressData.address;
                  return (
                    <div
                      key={tx.hash}
                      className="p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={isOutgoing ? "destructive" : "default"} className="text-xs">
                              {isOutgoing ? "OUT" : "IN"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{tx.timestamp}</span>
                          </div>
                          <Link
                            to={`/tx/${tx.hash}`}
                            className="font-mono text-sm text-primary hover:text-primary-glow transition-colors break-all"
                          >
                            {tx.hash}
                          </Link>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {isOutgoing ? "To" : "From"}
                          </p>
                          <Link
                            to={`/address/${isOutgoing ? tx.to : tx.from}`}
                            className="font-mono text-primary hover:text-primary-glow transition-colors break-all"
                          >
                            {isOutgoing ? tx.to : tx.from}
                          </Link>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Value</p>
                          <p className={`font-semibold ${isOutgoing ? 'text-destructive' : 'text-success'}`}>
                            {isOutgoing ? '-' : '+'}{tx.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressDetail;
