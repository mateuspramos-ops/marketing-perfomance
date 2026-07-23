"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
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
import { KpiCard, KpiGrid } from "@/components/kpis";
import { DataStatusBanner } from "@/components/data-status-banner";
import { useProductivityData } from "@/hooks/use-productivity-data";
import { formatHoras } from "@/lib/productivity-source";
import { getAllMonths, formatNumber } from "@/lib/data-service";
import { cn } from "@/lib/utils";
import {
  Clock,
  FolderKanban,
  ListChecks,
  Layers,
  Filter,
  Loader2,
} from "lucide-react";

const AVATAR_GRADIENTS = [
  "from-violet-500 to-fuchsia-500",
  "from-blue-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-purple-500",
];

const BAR_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#6366f1"];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function hashIndex(name: string, mod: number) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return hash % mod;
}

export default function ProductivityPage() {
  const { data, isDemo, error, loading, refresh } = useProductivityData();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const months = getAllMonths();
  const years = useMemo(
    () => [...new Set(data.map((d) => d.ano))].sort((a, b) => a - b),
    [data]
  );

  useEffect(() => {
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[years.length - 1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [years]);

  const filtered = useMemo(() => {
    return data.filter(
      (d) =>
        (!selectedMonth || d.mes === selectedMonth) &&
        (!selectedYear || d.ano === selectedYear)
    );
  }, [data, selectedMonth, selectedYear]);

  const totals = useMemo(
    () => ({
      horas: filtered.reduce((acc, d) => acc + d.totalHoras, 0),
      projetos: filtered.reduce((acc, d) => acc + d.qtdProjetos, 0),
      atividades: filtered.reduce((acc, d) => acc + d.qtdAtividades, 0),
      etapas: filtered.reduce((acc, d) => acc + d.qtdEtapas, 0),
    }),
    [filtered]
  );

  const porColaborador = useMemo(() => {
    const nomes = [...new Set(filtered.map((d) => d.colaborador))];
    return nomes
      .map((nome) => {
        const linhas = filtered.filter((d) => d.colaborador === nome);
        return {
          nome,
          primeiroNome: nome.split(" ")[0],
          horas: linhas.reduce((acc, d) => acc + d.totalHoras, 0),
          projetos: linhas.reduce((acc, d) => acc + d.qtdProjetos, 0),
          atividades: linhas.reduce((acc, d) => acc + d.qtdAtividades, 0),
          etapas: linhas.reduce((acc, d) => acc + d.qtdEtapas, 0),
          clientes: Math.max(...linhas.map((d) => d.qtdClientes), 0),
        };
      })
      .sort((a, b) => b.horas - a.horas);
  }, [filtered]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const HorasTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel rounded-xl border-0 p-3 text-sm">
          <p className="font-medium">{label}</p>
          <p className="mt-1 text-muted-foreground">
            {formatHoras(payload[0].value)} trabalhadas
          </p>
        </div>
      );
    }
    return null;
  };

  const VolumeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel rounded-xl border-0 p-3 text-sm">
          <p className="font-medium">{label}</p>
          <div className="mt-1 space-y-0.5 text-muted-foreground">
            {payload.map((p: any) => (
              <div key={p.dataKey} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </span>
                <span className="font-medium text-foreground">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Análise de <span className="text-gradient-brand">Produtividade</span>
            </h1>
            <p className="text-muted-foreground mt-1.5">
              Volume de trabalho e horas dedicadas por colaborador
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
                      <Filter className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium">Filtros:</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Select
                      value={selectedMonth || "all"}
                      onValueChange={(v) => setSelectedMonth(v === "all" || v === null ? "" : v)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Mês" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Meses</SelectItem>
                        {months.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(v) => setSelectedYear(parseInt(v ?? "2026"))}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* KPIs */}
          <motion.div variants={itemVariants}>
            <KpiGrid>
              <KpiCard
                title="Horas Trabalhadas"
                value={formatHoras(totals.horas)}
                subtitle={`${porColaborador.length} colaboradores`}
                icon={<Clock className="h-4 w-4" />}
              />
              <KpiCard
                title="Projetos"
                value={formatNumber(totals.projetos)}
                subtitle="no período"
                icon={<FolderKanban className="h-4 w-4" />}
                variant="success"
              />
              <KpiCard
                title="Atividades"
                value={formatNumber(totals.atividades)}
                subtitle="no período"
                icon={<ListChecks className="h-4 w-4" />}
                variant="warning"
              />
              <KpiCard
                title="Etapas"
                value={formatNumber(totals.etapas)}
                subtitle="no período"
                icon={<Layers className="h-4 w-4" />}
                variant="danger"
              />
            </KpiGrid>
          </motion.div>

          {/* Charts */}
          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 mt-6">
            <Card className="glass-panel border-0 transition-all duration-300 hover:shadow-[0_25px_55px_-25px_var(--primary)]">
              <CardHeader>
                <CardTitle className="text-lg">Horas por Colaborador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={porColaborador} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                      <XAxis dataKey="primeiroNome" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} className="text-muted-foreground" />
                      <Tooltip content={<HorasTooltip />} cursor={{ className: "fill-foreground/5" }} />
                      <Bar dataKey="horas" name="Horas" radius={[6, 6, 0, 0]} animationDuration={800}>
                        {porColaborador.map((entry, i) => (
                          <Cell key={entry.nome} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-0 transition-all duration-300 hover:shadow-[0_25px_55px_-25px_var(--primary)]">
              <CardHeader>
                <CardTitle className="text-lg">Projetos, Atividades e Etapas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={porColaborador} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                      <XAxis dataKey="primeiroNome" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} className="text-muted-foreground" />
                      <Tooltip content={<VolumeTooltip />} cursor={{ className: "fill-foreground/5" }} />
                      <Legend wrapperStyle={{ fontSize: "12px" }} formatter={(v) => <span className="text-muted-foreground">{v}</span>} />
                      <Bar dataKey="projetos" name="Projetos" fill="#8b5cf6" radius={[4, 4, 0, 0]} animationDuration={800} />
                      <Bar dataKey="atividades" name="Atividades" fill="#f59e0b" radius={[4, 4, 0, 0]} animationDuration={800} animationBegin={120} />
                      <Bar dataKey="etapas" name="Etapas" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={800} animationBegin={240} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Table */}
          <motion.div variants={itemVariants} className="mt-6">
            <Card className="glass-panel border-0">
              <CardHeader>
                <CardTitle className="text-lg">Detalhamento por Colaborador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-foreground/[0.08] text-muted-foreground">
                        <th className="py-3 px-4 text-left font-medium">Colaborador</th>
                        <th className="py-3 px-4 text-center font-medium">Clientes</th>
                        <th className="py-3 px-4 text-center font-medium">Projetos</th>
                        <th className="py-3 px-4 text-center font-medium">Atividades</th>
                        <th className="py-3 px-4 text-center font-medium">Etapas</th>
                        <th className="py-3 px-4 text-center font-medium">Horas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {porColaborador.map((c, i) => {
                        const gradient = AVATAR_GRADIENTS[hashIndex(c.nome, AVATAR_GRADIENTS.length)];
                        return (
                          <motion.tr
                            key={c.nome}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.3 }}
                            className="border-b border-foreground/[0.06] transition-colors hover:bg-foreground/[0.03]"
                          >
                            <td className="py-3 px-4 font-medium">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-semibold text-white shadow-sm",
                                    gradient
                                  )}
                                >
                                  {getInitials(c.nome)}
                                </div>
                                <span>{c.nome}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">{c.clientes}</td>
                            <td className="py-3 px-4 text-center">{c.projetos}</td>
                            <td className="py-3 px-4 text-center">{c.atividades}</td>
                            <td className="py-3 px-4 text-center">{c.etapas}</td>
                            <td className="py-3 px-4 text-center font-semibold text-primary">
                              {formatHoras(c.horas)}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
