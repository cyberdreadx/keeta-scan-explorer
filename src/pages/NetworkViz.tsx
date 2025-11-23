import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { useNetworkStats, useRecentBlocks, useRecentTransactions } from "@/hooks/useKeetaData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Radio } from "lucide-react";
import { formatKeetaAddress, formatKeetaAmount } from "@/lib/keetaOperations";

const NetworkViz = () => {
  const { data: networkStats } = useNetworkStats();
  const { data: recentBlocks = [] } = useRecentBlocks();
  const { data: recentTransactions = [] } = useRecentTransactions();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; vx: number; vy: number; size: number }>>([]);

  // Initialize particles
  useEffect(() => {
    const particleCount = 100;
    const newParticles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + Math.random() * 0.3})`;
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (otherIndex <= index) return;
          
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [particles]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none opacity-40"
      />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-cyan-950/20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      <Header />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Radio className="h-12 w-12 text-blue-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Network Visualization
            </h1>
            <Radio className="h-12 w-12 text-blue-400 animate-pulse" />
          </div>
          <p className="text-cyan-400/80 text-lg">Real-time Keeta Network Activity Monitor</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 animate-pulse">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2" />
              ONLINE
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              <Activity className="h-3 w-3 mr-1" />
              {recentTransactions.length} Active Streams
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-950/50 to-cyan-950/30 border-cyan-500/30 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-cyan-400/80 text-sm uppercase tracking-wider">Network Status</span>
                <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Active Nodes</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {networkStats?.activeRepresentatives || 0}
                  </span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-950/50 to-pink-950/30 border-purple-500/30 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-purple-400/80 text-sm uppercase tracking-wider">Total Blocks</span>
                <Activity className="h-5 w-5 text-purple-400" />
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {networkStats?.nodeStats?.ledger?.blockCount?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-400">
                  Processing at {recentBlocks.length} blocks/sec
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-950/50 to-emerald-950/30 border-green-500/30 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-green-400/80 text-sm uppercase tracking-wider">Transactions</span>
                <Radio className="h-5 w-5 text-green-400 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {networkStats?.nodeStats?.ledger?.transactionCount?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-400">
                  {recentTransactions.length} in latest batch
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Transaction Stream */}
        <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm mb-8">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="h-6 w-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-cyan-400">Live Transaction Stream</h2>
              <div className="ml-auto">
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 animate-pulse">
                  STREAMING
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {recentTransactions.slice(0, 10).map((tx: any, index: number) => {
                const hash = tx.$hash || tx.hash || "N/A";
                const amount = tx.operations?.[0]?.amount;
                
                return (
                  <div
                    key={hash}
                    className="group relative p-4 rounded-lg bg-gradient-to-r from-blue-950/30 to-transparent border border-blue-500/20 hover:border-cyan-500/50 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Glowing effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                          <Zap className="h-5 w-5 text-cyan-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm text-cyan-400">
                              {formatKeetaAddress(hash, 8)}
                            </span>
                            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs">
                              {tx.purpose === 1 ? 'ADMIN' : 'STANDARD'}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(tx.date).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      
                      {amount && (
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">
                            {formatKeetaAmount(amount)}
                          </div>
                          <div className="text-xs text-gray-400">KTA</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Progress bar animation */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Network Topology Visualization */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Radio className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-purple-400">Network Topology</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {networkStats?.representatives?.map((rep: any, index: number) => (
                <div
                  key={rep.representative}
                  className="relative p-4 rounded-lg bg-gradient-to-br from-purple-950/30 to-transparent border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 flex items-center justify-center animate-pulse">
                      <Radio className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-mono text-purple-400">
                        Node {index + 1}
                      </div>
                      <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-xs mt-1">
                        ACTIVE
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
      `}</style>
    </div>
  );
};

export default NetworkViz;
