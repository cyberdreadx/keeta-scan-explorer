import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getOperationType } from "@/lib/keetaOperations";

interface OperationTypesChartProps {
  data: any[];
  height?: number;
}

const getColorForOperation = (name: string): string => {
  // Find the operation type by name
  const operationType = Object.values(getOperationType(0).constructor).find(
    (type: any) => type?.name === name
  );
  
  // Map operation names to their type numbers
  const operationMap: Record<string, number> = {
    'Send': 0,
    'Receive': 1,
    'Transfer': 2,
    'Generate ID': 3,
    'Set Info': 4,
    'Modify Balance': 5,
    'Admin Supply': 6,
    'Conditional Receive': 7,
    'Update Permissions': 8,
  };
  
  const typeNumber = operationMap[name];
  if (typeNumber !== undefined) {
    return getOperationType(typeNumber).color;
  }
  
  return 'hsl(var(--muted-foreground))';
};

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
                <Cell key={`cell-${index}`} fill={getColorForOperation(entry.name)} />
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
