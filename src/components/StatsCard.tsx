import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  subtitle?: string;
}

const StatsCard = ({ title, value, icon: Icon, change, subtitle }: StatsCardProps) => {
  return (
    <Card className="border-border bg-card hover:bg-accent/5 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
        {change && (
          <p className="text-xs text-destructive font-medium">{change}</p>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
