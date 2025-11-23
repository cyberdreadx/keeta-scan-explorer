import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const Header = () => {
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
