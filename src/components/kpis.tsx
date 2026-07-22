"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/tilt-card";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "success" | "danger" | "warning";
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = "default",
}: KpiCardProps) {
  const iconBg = {
    default: "bg-gradient-brand",
    success: "bg-gradient-success",
    danger: "bg-gradient-danger",
    warning: "bg-gradient-warning",
  };

  const ringGlow = {
    default: "hover:shadow-[0_20px_45px_-20px_var(--primary)]",
    success: "hover:shadow-[0_20px_45px_-20px_oklch(0.72_0.19_150)]",
    danger: "hover:shadow-[0_20px_45px_-20px_oklch(0.65_0.22_25)]",
    warning: "hover:shadow-[0_20px_45px_-20px_oklch(0.78_0.16_75)]",
  };

  return (
    <TiltCard intensity={8}>
      <Card
        className={cn(
          "glass-panel border-0 transition-shadow duration-300",
          ringGlow[variant]
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-md",
              iconBg[variant]
            )}
            style={{ transform: "translateZ(24px)" }}
          >
            {icon}
          </div>
        </CardHeader>
        <CardContent style={{ transform: "translateZ(16px)" }}>
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          {(subtitle || trendValue) && (
            <div className="flex items-center gap-2 mt-1.5">
              {trend && trendValue && (
                <span
                  className={cn(
                    "flex items-center text-xs font-semibold",
                    trend === "up" && "text-emerald-600 dark:text-emerald-400",
                    trend === "down" && "text-red-600 dark:text-red-400",
                    trend === "neutral" && "text-muted-foreground"
                  )}
                >
                  {trend === "up" && <TrendingUp className="mr-1 h-3 w-3" />}
                  {trend === "down" && <TrendingDown className="mr-1 h-3 w-3" />}
                  {trendValue}
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-muted-foreground">{subtitle}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TiltCard>
  );
}

export function KpiGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}

export { CheckCircle2, AlertTriangle, Target, Clock };
