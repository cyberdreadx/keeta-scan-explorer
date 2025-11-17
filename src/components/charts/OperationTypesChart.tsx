import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface OperationTypesChartProps {
  data: any[];
  height?: number;
}

const COLORS = [
  'hsl(262, 83%, 58%)', 
  'hsl(180, 100%, 45%)', 
  'hsl(142, 71%, 45%)', 
  'hsl(0, 84%, 60%)', 
  'hsl(240, 5%, 65%)', 
  'hsl(280, 70%, 60%)', 
  'hsl(45, 100%, 50%)', 
  'hsl(320, 80%, 55%)'
];

export const OperationTypesChart = ({ data, height = 250 }: OperationTypesChartProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Network className="h-4 w-4 text-accent" />
          Operation Types
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
              outerRadius={height * 0.35}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
