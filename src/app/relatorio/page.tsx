"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DataStatusBanner } from "@/components/data-status-banner";
import { usePerformanceData } from "@/hooks/use-performance-data";
import {
  Printer,
  Copy,
  Download,
  User,
  Building2,
  Calendar,
  Target,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import {
  getCollaboratorData,
  getAllCollaborators,
  getAllMonths,
  getAllYears,
  formatPercent,
  formatNumber,
} from "@/lib/data-service";
import { cn } from "@/lib/utils";

export default function ReportPage() {
  const { data, isDemo, error, loading, refresh } = usePerformanceData();
  const [selectedCollaborator, setSelectedCollaborator] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const reportRef = useRef<HTMLDivElement>(null);

  const collaborators = useMemo(() => getAllCollaborators(data), [data]);
  const months = getAllMonths();
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

  const monthlyData = useMemo(() => {
    if (!collaboratorData || !selectedMonth) return null;
    return collaboratorData.dadosMensais.find((d) => d.mes === selectedMonth);
  }, [collaboratorData, selectedMonth]);

  if (loading && data.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    if (!collaboratorData || !monthlyData) return;

    const summary = `
RELATÓRIO DE PERFORMANCE - ${collaboratorData.nome}
${collaboratorData.cargo} | ${selectedMonth} ${selectedYear}

RESUMO:
- Total de Atividades: ${monthlyData.total}
- Em Dia: ${monthlyData.emDia} (${formatPercent((monthlyData.emDia / monthlyData.total) * 100)})
- Em Atraso: ${monthlyData.atraso} (${formatPercent((monthlyData.atraso / monthlyData.total) * 100)})
- Performance: ${formatPercent(monthlyData.performance)}
- Meta: 70%
- GAP: ${monthlyData.performance >= 70 ? "+" : ""}${formatPercent(monthlyData.performance - 70)}

ACUMULADO ANUAL:
- Total: ${collaboratorData.totalAnual.total} atividades
- Em Dia: ${collaboratorData.totalAnual.emDia}
- Em Atraso: ${collaboratorData.totalAnual.atraso}
- Performance Média: ${formatPercent(collaboratorData.totalAnual.mediaPerformance)}

Gerado em: ${new Date().toLocaleDateString("pt-BR")}
    `.trim();

    navigator.clipboard.writeText(summary);
    alert("Relatório copiado para a área de transferência!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Control Panel - Hidden when printing */}
      <div className="no-print">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold tracking-tight mb-2 sm:text-4xl">
              Ficha de <span className="text-gradient-brand">Avaliação Individual</span>
            </h1>
            <p className="text-muted-foreground mb-6">
              Gere relatórios profissionais para impressão ou envio
            </p>

            <DataStatusBanner isDemo={isDemo} error={error} onRefresh={refresh} />

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
                      value={selectedMonth}
                      onValueChange={(value) => setSelectedMonth(value ?? "")}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
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

            {collaboratorData && monthlyData && (
              <div className="flex gap-3">
                <Button onClick={handlePrint} className="gap-2 border-0 bg-gradient-brand text-white shadow-md shadow-primary/30 hover:opacity-90">
                  <Printer className="h-4 w-4" />
                  Imprimir / Salvar PDF
                </Button>
                <Button onClick={handleCopySummary} variant="outline" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copiar Resumo
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Report Content */}
      {collaboratorData && monthlyData && (
        <div className="container mx-auto px-4 py-8">
          <div ref={reportRef}>
            <Card className="glass-panel border-0 print:shadow-none print:border-0 print:bg-white">
              <CardContent className="p-8">
                {/* Report Header */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-1">
                    FICHA DE AVALIAÇÃO INDIVIDUAL
                  </h1>
                  <p className="text-muted-foreground">
                    Sistema de Gestão de Desempenho e Produtividade
                  </p>
                </div>

                <Separator className="my-6" />

                {/* Collaborator Info */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Colaborador:
                      </span>
                      <span className="font-semibold">
                        {collaboratorData.nome}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Cargo:
                      </span>
                      <span className="font-semibold">
                        {collaboratorData.cargo}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Período:
                      </span>
                      <span className="font-semibold">
                        {selectedMonth} {selectedYear}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Meta do Setor:
                      </span>
                      <span className="font-semibold">70%</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Monthly Performance */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4">DESEMPENHO MENSAL</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        Total de Atividades
                      </p>
                      <p className="text-2xl font-bold">
                        {monthlyData.total}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Em Dia</p>
                      <p className="text-2xl font-bold text-green-600">
                        {monthlyData.emDia}
                      </p>
                      <p className="text-xs text-green-600">
                        {formatPercent(
                          (monthlyData.emDia / monthlyData.total) * 100
                        )}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <p className="text-sm text-red-600 mb-1">Em Atraso</p>
                      <p className="text-2xl font-bold text-red-600">
                        {monthlyData.atraso}
                      </p>
                      <p className="text-xs text-red-600">
                        {formatPercent(
                          (monthlyData.atraso / monthlyData.total) * 100
                        )}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "p-4 rounded-lg",
                        monthlyData.performance >= 70
                          ? "bg-blue-50 dark:bg-blue-950/20"
                          : "bg-orange-50 dark:bg-orange-950/20"
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm mb-1",
                          monthlyData.performance >= 70
                            ? "text-blue-600"
                            : "text-orange-600"
                        )}
                      >
                        Performance
                      </p>
                      <p
                        className={cn(
                          "text-2xl font-bold",
                          monthlyData.performance >= 70
                            ? "text-blue-600"
                            : "text-orange-600"
                        )}
                      >
                        {formatPercent(monthlyData.performance)}
                      </p>
                      <Badge
                        className={cn(
                          "mt-1",
                          monthlyData.performance >= 70
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        )}
                      >
                        {monthlyData.performance >= 70
                          ? "Acima da Meta"
                          : "Abaixo da Meta"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* GAP Analysis */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4">ANÁLISE DE GAP</h2>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Distância da Meta
                        </p>
                        <p
                          className={cn(
                            "text-3xl font-bold",
                            monthlyData.performance >= 70
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {monthlyData.performance >= 70 ? "+" : ""}
                          {formatPercent(monthlyData.performance - 70)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Performance
                        </p>
                        <p className="text-xl font-semibold">
                          {formatPercent(monthlyData.performance)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Meta: 70%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Annual Summary */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4">ACUMULADO ANUAL</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        Total de Atividades
                      </p>
                      <p className="text-xl font-bold">
                        {collaboratorData.totalAnual.total}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Em Dia</p>
                      <p className="text-xl font-bold text-green-600">
                        {collaboratorData.totalAnual.emDia}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <p className="text-sm text-red-600 mb-1">Em Atraso</p>
                      <p className="text-xl font-bold text-red-600">
                        {collaboratorData.totalAnual.atraso}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        Performance Média
                      </p>
                      <p className="text-xl font-bold">
                        {formatPercent(
                          collaboratorData.totalAnual.mediaPerformance
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Qualitative Analysis */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4">
                    ANÁLISE QUALITATIVA
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-green-600 mb-2">
                        Pontos Fortes
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {monthlyData.performance >= 70
                          ? `Performance consistente acima da meta com ${formatPercent(monthlyData.performance)} de entregas no prazo. Boa gestão de tempo e cumprimento de prazos.`
                          : `Volume de atividades expressivo com ${monthlyData.total} tarefas executadas no período.`}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-orange-600 mb-2">
                        Pontos de Atenção
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {monthlyData.performance >= 70
                          ? "Manter o ritmo atual e buscar melhoria contínua."
                          : `Necessidade de melhorar o cumprimento de prazos. ${monthlyData.atraso} atividades realizadas com atraso representam ${
                              (monthlyData.atraso / monthlyData.total) * 100
                            }% do total.`}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-blue-600 mb-2">
                        Tendência
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {monthlyData.performance >= 70
                          ? "Colaborador demonstra evolução positiva e comprometimento com as metas do time."
                          : "Necessário acompanhamento para reverter a tendência de atrasos e atingir a meta de 70%."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <Separator className="my-6" />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <p>
                    Documento gerado em:{" "}
                    {new Date().toLocaleDateString("pt-BR")}
                  </p>
                  <p>Sistema de Gestão de Performance v1.0</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!collaboratorData || !monthlyData) && (
        <div className="container mx-auto px-4 py-8">
          <Card className="glass-panel border-0">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand shadow-lg shadow-primary/30">
                <Printer className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Configure o Relatório
              </h3>
              <p className="text-muted-foreground">
                Selecione um colaborador, mês e ano para gerar a ficha de avaliação
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
