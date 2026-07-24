"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KpiCard, KpiGrid } from "@/components/kpis";
import { DataStatusBanner } from "@/components/data-status-banner";
import { useCampaignData } from "@/hooks/use-campaign-data";
import { getAdsOverview, getAllAdsClients, formatCurrency } from "@/lib/ads-service";
import { formatNumber, formatPercent } from "@/lib/data-service";
import { getClientBrand } from "@/lib/client-brands";
import { AdPlatform } from "@/types";
import {
  Wallet,
  Eye,
  MousePointerClick,
  Target,
  Filter,
  Loader2,
} from "lucide-react";

const PLATFORM_COLORS: Record<AdPlatform, string> = {
  "Meta Ads": "#1877F2",
  "Google Ads": "#34A853",
};

const PERIOD_OPTIONS = [
  { label: "Últimos 7 dias", days: 7 },
  { label: "Últimos 14 dias", days: 14 },
  { label: "Últimos 30 dias", days: 30 },
  { label: "Tudo", days: 0 },
];

function subtractDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export default function CampaignsPage() {
  const { data, isDemo, error, loading, refresh } = useCampaignData();
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [periodDays, setPeriodDays] = useState(30);

  const clients = useMemo(() => getAllAdsClients(data), [data]);

  const mostRecentDate = useMemo(
    () => data.reduce((max, d) => (d.data > max ? d.data : max), ""),
    [data]
  );

  const overview = useMemo(() => {
    const dataInicio =
      periodDays > 0 && mostRecentDate ? subtractDays(mostRecentDate, periodDays - 1) : undefined;
    return getAdsOverview(data, {
      cliente: selectedClient || undefined,
      plataforma: (selectedPlatform || undefined) as AdPlatform | undefined,
      dataInicio,
    });
  }, [data, selectedClient, selectedPlatform, periodDays, mostRecentDate]);

  const distribuicaoPlataforma = overview.porPlataforma
    .filter((p) => p.investimento > 0)
    .map((p) => ({
      name: p.plataforma,
      value: Math.round(p.investimento * 100) / 100,
      color: PLATFORM_COLORS[p.plataforma],
    }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const SpendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel rounded-xl border-0 p-3 text-sm">
          <p className="font-medium">{formatDateLabel(label)}</p>
          <div className="mt-1 space-y-0.5 text-muted-foreground">
            {payload.map((p: any) => (
              <div key={p.dataKey} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </span>
                <span className="font-medium text-foreground">{formatCurrency(p.value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const PlatformTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="glass-panel rounded-xl border-0 p-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.payload.color }} />
            <span className="font-medium">{item.name}</span>
          </div>
          <div className="mt-1 text-muted-foreground">{formatCurrency(item.value)}</div>
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
              <span className="text-gradient-brand">Campanhas</span> de Anúncios
            </h1>
            <p className="text-muted-foreground mt-1.5">
              Desempenho consolidado de Meta Ads e Google Ads
            </p>
          </motion.div>

          {/* Data status */}
          <motion.div variants={itemVariants}>
            <DataStatusBanner
              isDemo={isDemo}
              error={error}
              onRefresh={refresh}
              demoMessage="Exibindo dados de demonstração. Conecte as APIs do Meta Ads e do Google Ads (ver README) para ver os números reais."
              errorMessage="Exibindo dados de demonstração — não foi possível ler as campanhas"
            />
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
                      value={selectedClient || "all"}
                      onValueChange={(v) => setSelectedClient(v === "all" || v === null ? "" : v)}
                    >
                      <SelectTrigger className="w-[190px]">
                        <SelectValue placeholder="Cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Clientes</SelectItem>
                        {clients.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedPlatform || "all"}
                      onValueChange={(v) => setSelectedPlatform(v === "all" || v === null ? "" : v)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Plataformas</SelectItem>
                        <SelectItem value="Meta Ads">Meta Ads</SelectItem>
                        <SelectItem value="Google Ads">Google Ads</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={periodDays.toString()}
                      onValueChange={(v) => setPeriodDays(parseInt(v ?? "30"))}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PERIOD_OPTIONS.map((p) => (
                          <SelectItem key={p.days} value={p.days.toString()}>
                            {p.label}
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
                title="Investimento Total"
                value={formatCurrency(overview.kpis.investimento)}
                subtitle={`CPC médio: ${formatCurrency(overview.kpis.cpc)}`}
                icon={<Wallet className="h-4 w-4" />}
              />
              <KpiCard
                title="Impressões"
                value={formatNumber(overview.kpis.impressoes)}
                subtitle={`${formatNumber(overview.kpis.cliques)} cliques`}
                icon={<Eye className="h-4 w-4" />}
                variant="success"
              />
              <KpiCard
                title="CTR Médio"
                value={formatPercent(overview.kpis.ctr)}
                subtitle="cliques / impressões"
                icon={<MousePointerClick className="h-4 w-4" />}
                variant="warning"
              />
              <KpiCard
                title="Conversões"
                value={formatNumber(overview.kpis.conversoes)}
                subtitle={`CPA médio: ${formatCurrency(overview.kpis.cpa)}`}
                icon={<Target className="h-4 w-4" />}
                variant="danger"
              />
            </KpiGrid>
          </motion.div>

          {/* Charts */}
          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 mt-6">
            <Card className="glass-panel border-0 transition-all duration-300 hover:shadow-[0_25px_55px_-25px_var(--primary)]">
              <CardHeader>
                <CardTitle className="text-lg">Investimento por Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overview.porDia} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="gradMeta" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={PLATFORM_COLORS["Meta Ads"]} stopOpacity={0.5} />
                          <stop offset="100%" stopColor={PLATFORM_COLORS["Meta Ads"]} stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="gradGoogle" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={PLATFORM_COLORS["Google Ads"]} stopOpacity={0.5} />
                          <stop offset="100%" stopColor={PLATFORM_COLORS["Google Ads"]} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                      <XAxis
                        dataKey="data"
                        tickFormatter={formatDateLabel}
                        tick={{ fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        className="text-muted-foreground"
                        minTickGap={24}
                      />
                      <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} className="text-muted-foreground" />
                      <Tooltip content={<SpendTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "12px" }} formatter={(v) => <span className="text-muted-foreground">{v}</span>} />
                      <Area
                        type="monotone"
                        dataKey="meta"
                        name="Meta Ads"
                        stroke={PLATFORM_COLORS["Meta Ads"]}
                        fill="url(#gradMeta)"
                        strokeWidth={2}
                        animationDuration={800}
                      />
                      <Area
                        type="monotone"
                        dataKey="google"
                        name="Google Ads"
                        stroke={PLATFORM_COLORS["Google Ads"]}
                        fill="url(#gradGoogle)"
                        strokeWidth={2}
                        animationDuration={800}
                        animationBegin={120}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-0 transition-all duration-300 hover:shadow-[0_25px_55px_-25px_var(--primary)]">
              <CardHeader>
                <CardTitle className="text-lg">Investimento por Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distribuicaoPlataforma}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        cornerRadius={8}
                        dataKey="value"
                        animationDuration={800}
                      >
                        {distribuicaoPlataforma.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip content={<PlatformTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "12px" }} formatter={(v) => <span className="text-muted-foreground">{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Table */}
          <motion.div variants={itemVariants} className="mt-6">
            <Card className="glass-panel border-0">
              <CardHeader>
                <CardTitle className="text-lg">Desempenho por Campanha</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-foreground/[0.08] text-muted-foreground">
                        <th className="py-3 px-4 text-left font-medium">Cliente</th>
                        <th className="py-3 px-4 text-left font-medium">Campanha</th>
                        <th className="py-3 px-4 text-center font-medium">Plataforma</th>
                        <th className="py-3 px-4 text-center font-medium">Investimento</th>
                        <th className="py-3 px-4 text-center font-medium">Cliques</th>
                        <th className="py-3 px-4 text-center font-medium">CTR</th>
                        <th className="py-3 px-4 text-center font-medium">CPC</th>
                        <th className="py-3 px-4 text-center font-medium">Conversões</th>
                        <th className="py-3 px-4 text-center font-medium">CPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overview.porCampanha.map((c, i) => {
                        const brand = getClientBrand(c.cliente);
                        return (
                          <motion.tr
                            key={`${c.cliente}-${c.plataforma}-${c.campanha}`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03, duration: 0.3 }}
                            className="border-b border-foreground/[0.06] transition-colors hover:bg-foreground/[0.03]"
                          >
                            <td className="py-3 px-4 font-medium whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-2 w-2 shrink-0 rounded-full"
                                  style={{ backgroundColor: brand.color }}
                                />
                                {c.cliente}
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">{c.campanha}</td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                                style={{ backgroundColor: PLATFORM_COLORS[c.plataforma] }}
                              >
                                {c.plataforma}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center font-medium">
                              {formatCurrency(c.investimento)}
                            </td>
                            <td className="py-3 px-4 text-center">{formatNumber(c.cliques)}</td>
                            <td className="py-3 px-4 text-center">{formatPercent(c.ctr)}</td>
                            <td className="py-3 px-4 text-center">{formatCurrency(c.cpc)}</td>
                            <td className="py-3 px-4 text-center">{formatNumber(c.conversoes)}</td>
                            <td className="py-3 px-4 text-center font-semibold text-primary">
                              {formatCurrency(c.cpa)}
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
