"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Loader2,
} from "lucide-react";
import { KpiCard, KpiGrid } from "@/components/kpis";
import { StackedBarChart, DonutChart } from "@/components/charts";
import { TeamTable } from "@/components/team-table";
import { Filters } from "@/components/filters";
import { DataStatusBanner } from "@/components/data-status-banner";
import { usePerformanceData } from "@/hooks/use-performance-data";
import {
  getDashboardData,
  getAllMonths,
  getAllYears,
  getAllClients,
  formatPercent,
  formatNumber,
} from "@/lib/data-service";
import { DashboardFilters } from "@/types";

export default function DashboardPage() {
  const { data, isDemo, error, loading, refresh } = usePerformanceData();
  const [filters, setFilters] = useState<DashboardFilters>({
    mes: "",
    ano: 2026,
    cliente: "",
  });

  const months = getAllMonths();
  const years = useMemo(() => getAllYears(data), [data]);
  const clients = useMemo(() => getAllClients(data), [data]);

  useEffect(() => {
    if (years.length > 0 && !years.includes(filters.ano ?? 0)) {
      setFilters((prev) => ({ ...prev, ano: years[years.length - 1] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [years]);

  const dashboardData = useMemo(
    () =>
      getDashboardData(data, {
        mes: filters.mes || undefined,
        ano: filters.ano || undefined,
        cliente: filters.cliente || undefined,
      }),
    [data, filters]
  );

  if (loading && data.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Painel de <span className="text-gradient-brand">Performance</span>
            </h1>
            <p className="text-muted-foreground mt-1.5">
              Acompanhe a produtividade e desempenho do time de marketing
            </p>
          </motion.div>

          {/* Data status */}
          <motion.div variants={itemVariants}>
            <DataStatusBanner isDemo={isDemo} error={error} onRefresh={refresh} />
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants}>
            <Filters
              months={months}
              years={years}
              clients={clients}
              selectedMonth={filters.mes}
              selectedYear={filters.ano}
              selectedClient={filters.cliente}
              onMonthChange={(mes) => setFilters((prev) => ({ ...prev, mes }))}
              onYearChange={(ano) => setFilters((prev) => ({ ...prev, ano }))}
              onClientChange={(cliente) =>
                setFilters((prev) => ({ ...prev, cliente }))
              }
            />
          </motion.div>

          {/* KPIs */}
          <motion.div variants={itemVariants}>
            <KpiGrid>
              <KpiCard
                title="Total de Atividades"
                value={formatNumber(dashboardData.kpis.totalAtividades)}
                subtitle={`${dashboardData.totalColaboradores} colaboradores`}
                icon={<BarChart3 className="h-4 w-4" />}
              />
              <KpiCard
                title="Atividades Em Dia"
                value={formatNumber(dashboardData.kpis.totalEmDia)}
                subtitle={formatPercent(dashboardData.kpis.percentualEmDia)}
                icon={<CheckCircle2 className="h-4 w-4" />}
                variant="success"
                trend="up"
                trendValue={`${formatPercent(dashboardData.kpis.percentualEmDia)}`}
              />
              <KpiCard
                title="Atividades Em Atraso"
                value={formatNumber(dashboardData.kpis.totalAtraso)}
                subtitle={formatPercent(dashboardData.kpis.percentualAtraso)}
                icon={<AlertTriangle className="h-4 w-4" />}
                variant="danger"
                trend="down"
                trendValue={`${formatPercent(dashboardData.kpis.percentualAtraso)}`}
              />
              <KpiCard
                title="Performance vs Meta"
                value={formatPercent(dashboardData.kpis.performanceMedia)}
                subtitle={`Meta: ${dashboardData.kpis.metaSetor}%`}
                icon={<Target className="h-4 w-4" />}
                variant={
                  dashboardData.kpis.gapGeral >= 0 ? "success" : "danger"
                }
                trend={dashboardData.kpis.gapGeral >= 0 ? "up" : "down"}
                trendValue={`GAP: ${
                  dashboardData.kpis.gapGeral >= 0 ? "+" : ""
                }${formatPercent(dashboardData.kpis.gapGeral)}`}
              />
            </KpiGrid>
          </motion.div>

          {/* Charts */}
          <motion.div
            variants={itemVariants}
            className="grid gap-6 md:grid-cols-2 mt-6"
          >
            <StackedBarChart data={dashboardData.chartData} />
            <DonutChart data={dashboardData.distribuicao} />
          </motion.div>

          {/* Team Table */}
          <motion.div variants={itemVariants} className="mt-6">
            <TeamTable data={dashboardData.dadosPorColaborador} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
