import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  subtitle?: string;
  isLoading?: boolean;
}

const StatsCard = ({ title, value, icon: Icon, change, subtitle, isLoading }: StatsCardProps) => {
  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            <div className="w-7 h-7 rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="h-5 w-32 bg-muted animate-pulse rounded mb-1" />
          <div className="h-2 w-20 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card hover:bg-accent/5 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
        <p className="text-xl font-bold text-foreground mb-1 break-words">{value}</p>
        {change && (
          <p className="text-[0.65rem] text-destructive font-medium">{change}</p>
        )}
        {subtitle && (
          <p className="text-[0.65rem] text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
