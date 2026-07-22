"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TiltCard } from "@/components/tilt-card";
import { DataStatusBanner } from "@/components/data-status-banner";
import { usePerformanceData } from "@/hooks/use-performance-data";
import {
  User,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Calendar,
  Loader2,
} from "lucide-react";
import {
  getCollaboratorData,
  getAllCollaborators,
  getAllYears,
  formatPercent,
  formatNumber,
} from "@/lib/data-service";
import { cn } from "@/lib/utils";

export default function CollaboratorPage() {
  const { data, isDemo, error, loading, refresh } = usePerformanceData();
  const [selectedCollaborator, setSelectedCollaborator] = useState("");
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const collaborators = useMemo(() => getAllCollaborators(data), [data]);
  const years = useMemo(() => getAllYears(data), [data]);

  useEffect(() => {
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[years.length - 1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [years]);

  const collaboratorData = useMemo(() => {
    if (!selectedCollaborator) return null;
    return getCollaboratorData(data, selectedCollaborator, selectedYear);
  }, [data, selectedCollaborator, selectedYear]);

  const lineChartData = useMemo(() => {
    if (!collaboratorData) return [];
    return collaboratorData.dadosMensais.map((d) => ({
      mes: d.mes.substring(0, 3),
      performance: d.performance,
      meta: 70,
    }));
  }, [collaboratorData]);

  const barChartData = useMemo(() => {
    if (!collaboratorData) return [];
    return collaboratorData.dadosMensais.map((d) => ({
      mes: d.mes.substring(0, 3),
      emDia: d.emDia,
      atraso: d.atraso,
    }));
  }, [collaboratorData]);

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
      transition: { staggerChildren: 0.1 },
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
              Perfil do <span className="text-gradient-brand">Colaborador</span>
            </h1>
            <p className="text-muted-foreground mt-1.5">
              Análise individual de performance e produtividade
            </p>
          </motion.div>

          {/* Data status */}
          <motion.div variants={itemVariants}>
            <DataStatusBanner isDemo={isDemo} error={error} onRefresh={refresh} />
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants}>
            <Card className="mb-6 glass-panel border-0">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-sm">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium">Colaborador:</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Select
                      value={selectedCollaborator}
                      onValueChange={(value) => setSelectedCollaborator(value ?? "")}
                    >
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Selecione um colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        {collaborators.map((collab) => (
                          <SelectItem key={collab} value={collab}>
                            {collab}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(value) => setSelectedYear(parseInt(value ?? "2026"))}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {collaboratorData ? (
            <>
              {/* Collaborator Header */}
              <motion.div variants={itemVariants}>
                <Card className="mb-6 glass-panel border-0">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand shadow-lg shadow-primary/30">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {collaboratorData.nome}
                        </h2>
                        <p className="text-muted-foreground">
                          {collaboratorData.cargo} • {selectedYear}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* KPIs */}
              <motion.div variants={itemVariants}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                  <TiltCard intensity={8}>
                  <Card className="glass-panel border-0 transition-shadow duration-300 hover:shadow-[0_20px_45px_-20px_var(--primary)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Anual
                      </CardTitle>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-md">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold tracking-tight">
                        {formatNumber(collaboratorData.totalAnual.total)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        atividades no ano
                      </p>
                    </CardContent>
                  </Card>
                  </TiltCard>

                  <TiltCard intensity={8}>
                  <Card className="glass-panel border-0 transition-shadow duration-300 hover:shadow-[0_20px_45px_-20px_oklch(0.72_0.19_150)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Em Dia
                      </CardTitle>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-success text-white shadow-md">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                        {formatNumber(collaboratorData.totalAnual.emDia)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {formatPercent(
                          (collaboratorData.totalAnual.emDia /
                            collaboratorData.totalAnual.total) *
                            100
                        )}{" "}
                        do total
                      </p>
                    </CardContent>
                  </Card>
                  </TiltCard>

                  <TiltCard intensity={8}>
                  <Card className="glass-panel border-0 transition-shadow duration-300 hover:shadow-[0_20px_45px_-20px_oklch(0.65_0.22_25)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Em Atraso
                      </CardTitle>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-danger text-white shadow-md">
                        <TrendingDown className="h-4 w-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold tracking-tight text-red-600 dark:text-red-400">
                        {formatNumber(collaboratorData.totalAnual.atraso)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {formatPercent(
                          (collaboratorData.totalAnual.atraso /
                            collaboratorData.totalAnual.total) *
                            100
                        )}{" "}
                        do total
                      </p>
                    </CardContent>
                  </Card>
                  </TiltCard>

                  <TiltCard intensity={8}>
                  <Card className="glass-panel border-0 transition-shadow duration-300 hover:shadow-[0_20px_45px_-20px_var(--primary)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Performance Média
                      </CardTitle>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-md">
                        <Target className="h-4 w-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold tracking-tight">
                        {formatPercent(collaboratorData.totalAnual.mediaPerformance)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Meta: 70%
                      </p>
                      <Badge
                        className={cn(
                          "mt-2 border-0 text-white shadow-sm",
                          collaboratorData.totalAnual.mediaPerformance >= 70
                            ? "bg-gradient-success"
                            : "bg-gradient-danger"
                        )}
                      >
                        {collaboratorData.totalAnual.mediaPerformance >= 70
                          ? "Acima da Meta"
                          : "Abaixo da Meta"}
                      </Badge>
                    </CardContent>
                  </Card>
                  </TiltCard>
                </div>
              </motion.div>

              {/* Charts */}
              <motion.div
                variants={itemVariants}
                className="grid gap-6 md:grid-cols-2 mb-6"
              >
                <Card className="glass-panel border-0 transition-all duration-300 hover:shadow-[0_25px_55px_-25px_var(--primary)]">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Evolução da Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={lineChartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="gradLinePerf" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                          <XAxis dataKey="mes" className="text-muted-foreground" axisLine={false} tickLine={false} />
                          <YAxis className="text-muted-foreground" axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              backdropFilter: "blur(16px)",
                              border: "1px solid var(--border)",
                              borderRadius: "12px",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="performance"
                            name="Performance"
                            stroke="url(#gradLinePerf)"
                            strokeWidth={3}
                            dot={{ fill: "#8b5cf6", r: 4 }}
                            activeDot={{ r: 6 }}
                            animationDuration={900}
                          />
                          <Line
                            type="monotone"
                            dataKey="meta"
                            name="Meta (70%)"
                            stroke="#94a3b8"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-0 transition-all duration-300 hover:shadow-[0_25px_55px_-25px_var(--primary)]">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Em Dia vs Atraso por Mês
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={barChartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="gradBarEmDia" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#34d399" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                            <linearGradient id="gradBarAtraso" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f87171" />
                              <stop offset="100%" stopColor="#dc2626" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                          <XAxis dataKey="mes" className="text-muted-foreground" axisLine={false} tickLine={false} />
                          <YAxis className="text-muted-foreground" axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              backdropFilter: "blur(16px)",
                              border: "1px solid var(--border)",
                              borderRadius: "12px",
                            }}
                          />
                          <Legend />
                          <Bar dataKey="emDia" name="Em Dia" fill="url(#gradBarEmDia)" radius={[6, 6, 0, 0]} animationDuration={800} />
                          <Bar dataKey="atraso" name="Atraso" fill="url(#gradBarAtraso)" radius={[6, 6, 0, 0]} animationDuration={800} animationBegin={150} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Monthly Details Table */}
              <motion.div variants={itemVariants}>
                <Card className="glass-panel border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Detalhamento Mensal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-foreground/[0.08]">
                            <th className="py-3 px-4 text-left font-medium text-muted-foreground">
                              Mês
                            </th>
                            <th className="py-3 px-4 text-center font-medium text-muted-foreground">
                              Em Dia
                            </th>
                            <th className="py-3 px-4 text-center font-medium text-muted-foreground">
                              Atraso
                            </th>
                            <th className="py-3 px-4 text-center font-medium text-muted-foreground">
                              Total
                            </th>
                            <th className="py-3 px-4 text-center font-medium text-muted-foreground">
                              Performance
                            </th>
                            <th className="py-3 px-4 text-center font-medium text-muted-foreground">
                              Meta
                            </th>
                            <th className="py-3 px-4 text-center font-medium text-muted-foreground">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {collaboratorData.dadosMensais.map((mes) => (
                            <tr
                              key={mes.mes}
                              className="border-b border-foreground/[0.06] transition-colors hover:bg-foreground/[0.03]"
                            >
                              <td className="py-3 px-4 font-medium">{mes.mes}</td>
                              <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400">
                                {mes.emDia}
                              </td>
                              <td className="py-3 px-4 text-center text-red-600 dark:text-red-400">
                                {mes.atraso}
                              </td>
                              <td className="py-3 px-4 text-center font-medium">
                                {mes.total}
                              </td>
                              <td className="py-3 px-4 text-center font-medium">
                                {formatPercent(mes.performance)}
                              </td>
                              <td className="py-3 px-4 text-center text-muted-foreground">
                                70%
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Badge
                                  className={cn(
                                    "border-0 text-white shadow-sm",
                                    mes.performance >= 70
                                      ? "bg-gradient-success"
                                      : "bg-gradient-danger"
                                  )}
                                >
                                  {mes.performance >= 70 ? "OK" : "Atenção"}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="glass-panel border-0">
                <CardContent className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand shadow-lg shadow-primary/30">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Selecione um Colaborador
                  </h3>
                  <p className="text-muted-foreground">
                    Escolha um colaborador acima para visualizar sua performance
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
