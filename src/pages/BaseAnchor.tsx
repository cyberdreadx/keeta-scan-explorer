import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAccountInfo } from "@/hooks/useKeetaData";
import { useBaseTransactions } from "@/hooks/useBaseTransactions";
import { Anchor, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { formatKeetaAmount } from "@/lib/keetaOperations";
import { getTokenMetadata } from "@/lib/tokenMetadata";
import { formatDistanceToNow } from "date-fns";
import { BASE_ANCHOR_ADDRESS } from "@/lib/addressLabels";

const BASE_EVM_ADDRESS = "0x1c24a0fb7bcf2154a9d37b7b3aa443bc63fcc698";

const SUPPORTED_ASSETS = [
  "keeta_anqdilpazdekdu4acw65fj7smltcp26wbrildkqtszqvverljpwpezmd44ssg", // KTA
  "keeta_amnkge74xitii5dsobstldatv3irmyimujfjotftx7plaaaseam4bntb7wnna", // USDC
  "keeta_apblhar4ncp3ln62wrygsn73pt3houuvj7ic47aarnolpcu67oqn4xqcji3au", // EURC
  "keeta_apyez4az5r6shtblf3qtzirmikq3tghb5svrmmrltdkxgnnzzhlstby3cuscc", // CBBTC
];

const BaseAnchor = () => {
  const { data: accountInfo, isLoading: isLoadingKeeta } = useAccountInfo(BASE_ANCHOR_ADDRESS);
  const { data: baseTransactions = [], isLoading: isLoadingBase } = useBaseTransactions(BASE_EVM_ADDRESS);

  // Get transaction history from account info
  const keetaBridgeTransactions = accountInfo?.transactions || [];

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Anchor className="h-8 w-8 text-primary" />
          Keeta Base Anchor
        </h1>
        <p className="text-muted-foreground mb-4">
          Cross-chain asset movement between Keeta and Base (EVM)
        </p>
        <p className="text-sm text-muted-foreground max-w-3xl">
          The Keeta Base Anchor is an inbound and outbound asset movement anchor that enables 
          seamless asset transfers between the Keeta and the Base network.
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        {/* Bridge Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Bridge Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Badge variant="outline" className="shrink-0">Keeta</Badge>
              <Link 
                to={`/address/${BASE_ANCHOR_ADDRESS}`}
                className="font-mono text-sm hover:text-primary transition-colors break-all"
              >
                {BASE_ANCHOR_ADDRESS}
              </Link>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Badge variant="outline" className="shrink-0">Base</Badge>
              <a 
                href={`https://basescan.org/address/${BASE_EVM_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm hover:text-primary transition-colors flex items-center gap-2"
              >
                {BASE_EVM_ADDRESS}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Supported Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {SUPPORTED_ASSETS.map((address) => {
                const metadata = getTokenMetadata(address);
                return (
                  <Link
                    key={address}
                    to={`/token/${address}`}
                    className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {metadata?.imageUrl && (
                      <img src={metadata.imageUrl} alt={metadata.symbol} className="h-6 w-6 rounded-full" />
                    )}
                    <span className="font-semibold">{metadata?.symbol || 'Unknown'}</span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keeta Network Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Keeta Bridge Transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Transactions on the Keeta network involving the Base Anchor
          </p>
        </CardHeader>
        <CardContent>
          {isLoadingKeeta ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading Keeta bridge transactions...
            </div>
          ) : keetaBridgeTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keetaBridgeTransactions.map((block: any) => {
                    const mainOp = block.operations?.[0];
                    const token = mainOp?.token;
                    const metadata = getTokenMetadata(token);
                    const amount = formatKeetaAmount(mainOp?.amount || "0x0", token);
                    
                    return (
                      <TableRow key={block.$hash || block.hash}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {metadata?.imageUrl && (
                              <img src={metadata.imageUrl} alt={metadata.symbol} className="h-5 w-5 rounded-full" />
                            )}
                            <span className="font-semibold">
                              {amount} {metadata?.symbol || 'Unknown'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                            Completed
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/address/${block.account}`}
                            className="text-primary hover:underline font-mono text-xs flex items-center gap-1"
                          >
                            {block.account?.substring(0, 10)}...{block.account?.slice(-6)}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(block.date), { addSuffix: true })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No recent Keeta bridge transactions found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Base Network Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Base Bridge Transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Transactions on the Base EVM network involving the Base Anchor
          </p>
        </CardHeader>
        <CardContent>
          {isLoadingBase ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading Base transactions...
            </div>
          ) : baseTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tx Hash</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Value (ETH)</TableHead>
                    <TableHead>Age</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {baseTransactions.slice(0, 10).map((tx: any) => (
                    <TableRow key={tx.hash}>
                      <TableCell>
                        <a
                          href={`https://basescan.org/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono text-xs flex items-center gap-1"
                        >
                          {tx.hash.substring(0, 10)}...{tx.hash.slice(-6)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="default" 
                          className={tx.isError === "0" 
                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" 
                            : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                          }
                        >
                          {tx.isError === "0" ? "Success" : "Failed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`https://basescan.org/address/${tx.from}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono text-xs"
                        >
                          {tx.from.substring(0, 6)}...{tx.from.slice(-4)}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`https://basescan.org/address/${tx.to}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono text-xs"
                        >
                          {tx.to.substring(0, 6)}...{tx.to.slice(-4)}
                        </a>
                      </TableCell>
                      <TableCell>
                        {(parseInt(tx.value) / 1e18).toFixed(6)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(parseInt(tx.timeStamp) * 1000), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No recent Base bridge transactions found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BaseAnchor;
