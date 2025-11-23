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
