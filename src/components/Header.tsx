import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useState, KeyboardEvent } from "react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Check if it's a Keeta address (starts with keeta_)
    if (searchQuery.startsWith("keeta_")) {
      navigate(`/address/${searchQuery.trim()}`);
    } else {
      // Assume it's a transaction hash
      navigate(`/transaction/${searchQuery.trim()}`);
    }
    
    setSearchQuery("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Link to="/" className="flex items-center gap-2">
              <span className="text-lg font-semibold text-foreground">Keeta Network</span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search addresses, transactions..."
                className="pl-10 bg-muted/50 border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                ⌘ K
              </kbd>
            </div>
          </div>

          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
