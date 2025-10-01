import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, CheckCircle2, Clock } from "lucide-react";

const TransactionDetail = () => {
  const { hash } = useParams();

  // Mock data
  const transaction = {
    hash: hash || "",
    status: "success" as const,
    block: "1,234,567",
    timestamp: new Date().toISOString(),
    from: "0x" + Math.random().toString(16).substring(2, 42),
    to: "0x" + Math.random().toString(16).substring(2, 42),
    value: "15.5432 KTA",
    transactionFee: "0.0021 KTA",
    gasPrice: "20 Gwei",
    gasLimit: "21,000",
    gasUsed: "21,000 (100%)",
    nonce: "42",
    position: "156",
  };

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
            <div className="flex items-center justify-between">
              <CardTitle>Overview</CardTitle>
              <Badge
                variant="default"
                className="flex items-center gap-1"
              >
                <CheckCircle2 className="h-3 w-3" />
                {transaction.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
                <p className="font-mono text-sm break-all">{transaction.hash}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Block</p>
                  <Link
                    to={`/block/${transaction.block}`}
                    className="text-primary hover:text-primary-glow transition-colors font-semibold"
                  >
                    {transaction.block}
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{new Date(transaction.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">From</p>
                    <Link
                      to={`/address/${transaction.from}`}
                      className="font-mono text-sm text-primary hover:text-primary-glow transition-colors break-all"
                    >
                      {transaction.from}
                    </Link>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">To</p>
                    <Link
                      to={`/address/${transaction.to}`}
                      className="font-mono text-sm text-primary hover:text-primary-glow transition-colors break-all"
                    >
                      {transaction.to}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Value</p>
                    <p className="font-semibold text-lg">{transaction.value}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transaction Fee</p>
                    <p className="text-sm">{transaction.transactionFee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Gas Price</p>
                    <p className="text-sm">{transaction.gasPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Gas Limit</p>
                    <p className="text-sm">{transaction.gasLimit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Gas Used</p>
                    <p className="text-sm">{transaction.gasUsed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nonce</p>
                    <p className="text-sm">{transaction.nonce}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Position in Block</p>
                    <p className="text-sm">{transaction.position}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetail;
