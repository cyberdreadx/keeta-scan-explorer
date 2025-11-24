import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { useNetworkStats, useRecentBlocks, useRecentTransactions } from "@/hooks/useKeetaData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Radio } from "lucide-react";
import { formatKeetaAddress, formatKeetaAmount } from "@/lib/keetaOperations";

interface Node {
  x: number;
  y: number;
  id: string;
  index: number;
}

interface Pulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

const NetworkViz = () => {
  const { data: networkStats } = useNetworkStats();
  const { data: recentBlocks = [] } = useRecentBlocks();
  const { data: recentTransactions = [] } = useRecentTransactions();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const animationRef = useRef<number>();

  // Initialize nodes in a circle pattern
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateNodes = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      const nodeCount = 4; // 4 representatives

      const newNodes = Array.from({ length: nodeCount }, (_, i) => {
        const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
        return {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          id: `node-${i}`,
          index: i,
        };
      });
      setNodes(newNodes);
    };

    updateNodes();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updateNodes();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add pulses when new transactions arrive
  useEffect(() => {
    if (recentTransactions.length > 0 && nodes.length > 0) {
      const fromNode = Math.floor(Math.random() * nodes.length);
      const toNode = (fromNode + 1 + Math.floor(Math.random() * (nodes.length - 1))) % nodes.length;
      
      const colors = ['#22d3ee', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];
      const newPulse: Pulse = {
        fromNode,
        toNode,
        progress: 0,
        speed: 0.01 + Math.random() * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      
      pulsesRef.current = [...pulsesRef.current, newPulse];
      setPulses(pulsesRef.current);
    }
  }, [recentTransactions.length, nodes.length]);

  // Animate the network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (nodes.length === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Draw wires between all nodes
      nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
          if (i >= j) return;

          // Draw wire
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(otherNode.x, otherNode.y);
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw glowing core
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(otherNode.x, otherNode.y);
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      // Update and draw pulses
      pulsesRef.current = pulsesRef.current.filter(pulse => {
        pulse.progress += pulse.speed;
        
        if (pulse.progress >= 1) {
          return false; // Remove completed pulses
        }

        const fromNode = nodes[pulse.fromNode];
        const toNode = nodes[pulse.toNode];
        
        if (!fromNode || !toNode) return false;

        const x = fromNode.x + (toNode.x - fromNode.x) * pulse.progress;
        const y = fromNode.y + (toNode.y - fromNode.y) * pulse.progress;

        // Draw pulse glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        gradient.addColorStop(0, pulse.color);
        gradient.addColorStop(0.5, pulse.color.replace(')', ', 0.5)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Draw pulse core
        ctx.fillStyle = pulse.color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw trail
        const trailLength = 30;
        for (let i = 1; i <= trailLength; i++) {
          const trailProgress = Math.max(0, pulse.progress - (i * 0.01));
          const trailX = fromNode.x + (toNode.x - fromNode.x) * trailProgress;
          const trailY = fromNode.y + (toNode.y - fromNode.y) * trailProgress;
          const opacity = 1 - (i / trailLength);
          
          ctx.fillStyle = pulse.color.replace(')', `, ${opacity * 0.5})`).replace('rgb', 'rgba');
          ctx.beginPath();
          ctx.arc(trailX, trailY, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        return true;
      });

      setPulses(pulsesRef.current);

      // Draw nodes
      nodes.forEach((node, i) => {
        // Node outer glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 30);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Node ring
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.stroke();

        // Node inner ring (animated)
        const pulsePhase = (Date.now() / 1000 + i * 0.5) % 1;
        const pulseSize = 15 + pulsePhase * 5;
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.8 - pulsePhase * 0.6})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.stroke();

        // Node core
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Node center dot
        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-cyan-950/20 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none z-0" />

      <div className="relative z-50">
        <Header />
      </div>

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
          <p className="text-cyan-400/80 text-lg">Real-time Data Flow Visualization</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 animate-pulse">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2" />
              LIVE
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              <Activity className="h-3 w-3 mr-1" />
              {pulses.length} Active Transmissions
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-950/50 to-cyan-950/30 border-cyan-500/30 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-cyan-400/80 text-sm uppercase tracking-wider">Network Nodes</span>
                <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Active</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {networkStats?.activeRepresentatives || 0}
                  </span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" style={{ width: '100%' }} />
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
                  {recentBlocks.length} recent blocks
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-950/50 to-emerald-950/30 border-green-500/30 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-green-400/80 text-sm uppercase tracking-wider">Data Packets</span>
                <Radio className="h-5 w-5 text-green-400 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {networkStats?.nodeStats?.ledger?.transactionCount?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-400">
                  {recentTransactions.length} streaming now
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Transaction Stream */}
        <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="h-6 w-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-cyan-400">Live Data Stream</h2>
              <div className="ml-auto">
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 animate-pulse">
                  TRANSMITTING
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
              {recentTransactions.slice(0, 8).map((tx: any, index: number) => {
                const hash = tx.$hash || tx.hash || "N/A";
                const amount = tx.operations?.[0]?.amount;
                
                return (
                  <div
                    key={hash}
                    className="group relative p-4 rounded-lg bg-gradient-to-r from-blue-950/30 to-transparent border border-blue-500/20 hover:border-cyan-500/50 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
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
                    
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
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
