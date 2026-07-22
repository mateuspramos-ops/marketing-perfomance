"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BarChartData {
  nome: string;
  emDia: number;
  atraso: number;
  total: number;
}

interface StackedBarChartProps {
  data: BarChartData[];
  title?: string;
}

export function StackedBarChart({
  data,
  title = "Entregas por Colaborador",
}: StackedBarChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const emDia = payload.find((p: any) => p.dataKey === "emDia")?.value || 0;
      const atraso = payload.find((p: any) => p.dataKey === "atraso")?.value || 0;
      const total = emDia + atraso;

      return (
        <div className="glass-panel rounded-xl border-0 p-3">
          <p className="font-medium">{label}</p>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Em Dia
              </span>
              <span className="font-medium">{emDia}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Atraso
              </span>
              <span className="font-medium">{atraso}</span>
            </div>
            <div className="border-t border-foreground/10 pt-1">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">Total</span>
                <span className="font-medium">{total}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-panel border-0 transition-all duration-300 hover:shadow-[0_25px_55px_-25px_var(--primary)]">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="gradEmDia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="gradAtraso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis
                dataKey="nome"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "currentColor", className: "fill-foreground/5" }} />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => (
                  <span className="text-muted-foreground">{value}</span>
                )}
              />
              <Bar
                dataKey="emDia"
                name="Em Dia"
                fill="url(#gradEmDia)"
                stackId="a"
                radius={[0, 0, 0, 0]}
                animationDuration={800}
              />
              <Bar
                dataKey="atraso"
                name="Atraso"
                fill="url(#gradAtraso)"
                stackId="a"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
                animationBegin={150}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface DonutChartData {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartData[];
  title?: string;
}

export function DonutChart({ data, title = "Distribuição de Entregas" }: DonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const gradientIds = ["gradSlice0", "gradSlice1", "gradSlice2", "gradSlice3"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percent = ((item.value / total) * 100).toFixed(1);

      return (
        <div className="glass-panel rounded-xl border-0 p-3">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.payload.color }}
            />
            <span className="font-medium">{item.name}</span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {item.value} atividades ({percent}%)
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-semibold"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="glass-panel border-0 transition-all duration-300 hover:shadow-[0_25px_55px_-25px_var(--primary)]">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {data.map((entry, index) => (
                  <radialGradient
                    key={gradientIds[index % gradientIds.length]}
                    id={gradientIds[index % gradientIds.length]}
                    cx="35%"
                    cy="35%"
                    r="70%"
                  >
                    <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                  </radialGradient>
                ))}
                <filter id="donutShadow" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="6" stdDeviation="10" floodOpacity="0.25" />
                </filter>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                cornerRadius={8}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
                filter="url(#donutShadow)"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#${gradientIds[index % gradientIds.length]})`}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => (
                  <span className="text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
