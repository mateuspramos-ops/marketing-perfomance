import { PerformanceData, DashboardFilters, CollaboratorProfile, MonthlyStats } from "@/types";
import { mesesOrdem } from "@/data/mock";

export function getDashboardData(source: PerformanceData[], filters?: DashboardFilters) {
  let data = [...source];

  if (filters?.mes) {
    data = data.filter((d) => d.mes === filters.mes);
  }
  if (filters?.ano) {
    data = data.filter((d) => d.ano === filters.ano);
  }
  if (filters?.cliente) {
    data = data.filter((d) => d.cliente === filters.cliente);
  }

  const totalEmDia = data.reduce((acc, d) => acc + d.emDia, 0);
  const totalAtraso = data.reduce((acc, d) => acc + d.atraso, 0);
  const totalAtividades = data.reduce((acc, d) => acc + d.totalAtividades, 0);
  const performanceMedia = totalAtividades > 0 ? (totalEmDia / totalAtividades) * 100 : 0;
  const metaSetor = 70;
  const gapGeral = performanceMedia - metaSetor;

  const colaboradores = [...new Set(data.map((d) => d.colaborador))];
  const dadosPorColaborador = colaboradores.map((col) => {
    const dados = data.filter((d) => d.colaborador === col);
    return {
      nome: col,
      cargo: dados[0]?.cargo || "",
      emDia: dados.reduce((acc, d) => acc + d.emDia, 0),
      atraso: dados.reduce((acc, d) => acc + d.atraso, 0),
      total: dados.reduce((acc, d) => acc + d.totalAtividades, 0),
      performance: dados.reduce((acc, d) => acc + d.performancePercentual, 0) / dados.length,
      meta: dados[0]?.metaPercentual || 70,
      gap: dados.reduce((acc, d) => acc + d.gapPercentual, 0) / dados.length,
    };
  });

  const chartData = dadosPorColaborador.map((d) => ({
    nome: d.nome.split(" ")[0],
    emDia: d.emDia,
    atraso: d.atraso,
    total: d.total,
  }));

  const distribuicao = [
    { name: "Em Dia", value: totalEmDia, color: "#22c55e" },
    { name: "Atraso", value: totalAtraso, color: "#ef4444" },
  ];

  return {
    kpis: {
      totalAtividades,
      totalEmDia,
      totalAtraso,
      percentualEmDia: totalAtividades > 0 ? (totalEmDia / totalAtividades) * 100 : 0,
      percentualAtraso: totalAtividades > 0 ? (totalAtraso / totalAtividades) * 100 : 0,
      performanceMedia,
      metaSetor,
      gapGeral,
    },
    dadosPorColaborador,
    chartData,
    distribuicao,
    totalColaboradores: colaboradores.length,
  };
}

export function getCollaboratorData(
  source: PerformanceData[],
  nome: string,
  ano?: number
): CollaboratorProfile | null {
  const dados = source.filter(
    (d) => d.colaborador === nome && (!ano || d.ano === ano)
  );

  if (dados.length === 0) return null;

  const dadosMensais: MonthlyStats[] = dados.map((d) => ({
    mes: d.mes,
    emDia: d.emDia,
    atraso: d.atraso,
    total: d.totalAtividades,
    performance: d.performancePercentual,
  }));

  const totalAnual = {
    emDia: dados.reduce((acc, d) => acc + d.emDia, 0),
    atraso: dados.reduce((acc, d) => acc + d.atraso, 0),
    total: dados.reduce((acc, d) => acc + d.totalAtividades, 0),
    mediaPerformance: dados.reduce((acc, d) => acc + d.performancePercentual, 0) / dados.length,
  };

  return {
    nome,
    cargo: dados[0].cargo,
    dadosMensais,
    totalAnual,
  };
}

export function getAllCollaborators(source: PerformanceData[]): string[] {
  return [...new Set(source.map((d) => d.colaborador))];
}

export function getAllMonths(): string[] {
  return mesesOrdem;
}

export function getAllYears(source: PerformanceData[]): number[] {
  return [...new Set(source.map((d) => d.ano))].sort();
}

export function getAllClients(source: PerformanceData[]): string[] {
  return [...new Set(source.map((d) => d.cliente))];
}

export function getPerformanceStatus(performance: number, meta: number): "acima" | "abaixo" | "na-meta" {
  if (performance >= meta) return "acima";
  if (performance >= meta - 5) return "na-meta";
  return "abaixo";
}

export function getGapStatus(gap: number): "positivo" | "negativo" | "neutro" {
  if (gap > 0) return "positivo";
  if (gap < 0) return "negativo";
  return "neutro";
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR");
}
