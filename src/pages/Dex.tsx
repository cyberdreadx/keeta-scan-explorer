import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { getTokenSymbol } from "@/lib/tokenMetadata";
import { TrendingUp, Clock, Plus, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { TokenRow } from "@/components/TokenRow";
import { useNavigate } from "react-router-dom";

export default function Dex() {
  const navigate = useNavigate();
  const [filterTokens, setFilterTokens] = useState<string[]>([]);
  const [tokenInput, setTokenInput] = useState("");

  // All defined tokens
  const allDefinedTokens = [
    "keeta_aabiku5vlchcgsxqwj6o4sryvqucaywcb46advac425biaroqzhibaaj7mt6a6i", // BPACA
    "keeta_aabjew5wmckwg2vuccvu4h2gkildyrp2nlmdocebwfchxmhh7xb6g6y6rzvcxda", // PACA
    "keeta_aabsuldj4srhjx2rfgzf3b5c55i4vqoo2kmisbc62vd4qd2bmqkmu2mdr4l3zqi", // NDA
    "keeta_aabwqabactqc3s7lq4khxbpcze7cfux75iuixpevlfsrvwwf3ecdznegnn52m7q", // DRINK
    "keeta_aabwi6k5rislbhevld3frsfaso2d3v3t7u436clp5fqtsapppyjrzf4deuqyvdi", // AKTA
    "keeta_ao55q4okjv4hrbo7z7zl3hivrf64og3fpokup5hvt2wfejim5mxzxcykboc3w", // PACA (duplicate)
    "keeta_anin2xcn2ijmhezrmrzyoabztxc5kq43n3ftr4bziw2unvg46dvncqkbbpc72", // KCHAD
  ];

  const displayTokens = filterTokens.length > 0 ? filterTokens : allDefinedTokens;

  const addToken = () => {
    const trimmed = tokenInput.trim();
    if (trimmed && !filterTokens.includes(trimmed)) {
      setFilterTokens([...filterTokens, trimmed]);
      setTokenInput("");
    }
  };

  const removeToken = (token: string) => {
    setFilterTokens(filterTokens.filter(t => t !== token));
  };

  const clearFilters = () => {
    setFilterTokens([]);
  };


  return (
    <div className="min-h-screen bg-background relative">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <TrendingUp className="w-16 h-16 text-muted-foreground/50 mx-auto" />
          <h2 className="text-3xl font-bold">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            Token trading and analytics features are under development
          </p>
        </div>
      </div>

      {/* Header Stats */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Token Explorer</h1>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span className="text-muted-foreground">Live Data</span>
            </div>
          </div>
          
          {/* Live Indicator */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-2 py-2 px-4">
              <TrendingUp className="w-4 h-4" />
              Live Prices
            </Badge>
          </div>

          {/* Token Filter Input */}
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Paste token address to track (e.g., keeta_an...)"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addToken()}
                className="flex-1 font-mono text-sm"
              />
              <Button onClick={addToken} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Token
              </Button>
              {filterTokens.length > 0 && (
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Clear All
                </Button>
              )}
            </div>

            {/* Selected Tokens */}
            {filterTokens.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filterTokens.map((token) => {
                  const symbol = getTokenSymbol(token);
                  return (
                    <Badge key={token} variant="secondary" className="gap-2 py-1.5 px-3">
                      <span className="font-semibold text-xs">{symbol}</span>
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeToken(token)}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Token Table */}
      <div className="container mx-auto px-4 py-6">
        <Card className="border-border/50">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-semibold">#</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">TOKEN</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">PRICE</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">24H CHANGE</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">24H VOLUME</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">HOLDERS</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayTokens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      No tokens selected
                    </TableCell>
                  </TableRow>
                ) : (
                  displayTokens.map((token, idx) => (
                    <TokenRow 
                      key={token} 
                      token={token} 
                      rank={idx + 1}
                      onClick={() => navigate(`/token/${token}`)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
