import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "./pages/Home";
import Blocks from "./pages/Blocks";
import Transactions from "./pages/Transactions";
import Representatives from "./pages/Representatives";
import Statistics from "./pages/Statistics";
import BaseAnchor from "./pages/BaseAnchor";
import Dex from "./pages/Dex";
import BlockDetail from "./pages/BlockDetail";
import TransactionDetail from "./pages/TransactionDetail";
import AddressDetail from "./pages/AddressDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-hidden">
              <AppSidebar />
              <main className="flex-1 overflow-x-hidden">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blocks" element={<Blocks />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/representatives" element={<Representatives />} />
                  <Route path="/stats" element={<Statistics />} />
                  <Route path="/base-anchor" element={<BaseAnchor />} />
                  <Route path="/dex" element={<Dex />} />
                  <Route path="/block/:id" element={<BlockDetail />} />
                  <Route path="/tx/:hash" element={<TransactionDetail />} />
                  <Route path="/address/:address" element={<AddressDetail />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
