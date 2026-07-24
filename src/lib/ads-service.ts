import { CampaignData, AdPlatform } from "@/types";

export interface AdsFilters {
  cliente?: string;
  plataforma?: AdPlatform;
  dataInicio?: string; // ISO YYYY-MM-DD
  dataFim?: string; // ISO YYYY-MM-DD
}

function safeDiv(a: number, b: number): number {
  return b > 0 ? a / b : 0;
}

export function filterCampaignData(source: CampaignData[], filters?: AdsFilters): CampaignData[] {
  let data = [...source];
  if (filters?.cliente) data = data.filter((d) => d.cliente === filters.cliente);
  if (filters?.plataforma) data = data.filter((d) => d.plataforma === filters.plataforma);
  if (filters?.dataInicio) data = data.filter((d) => d.data >= filters.dataInicio!);
  if (filters?.dataFim) data = data.filter((d) => d.data <= filters.dataFim!);
  return data;
}

export function getAdsOverview(source: CampaignData[], filters?: AdsFilters) {
  const data = filterCampaignData(source, filters);

  const investimento = data.reduce((acc, d) => acc + d.investimento, 0);
  const impressoes = data.reduce((acc, d) => acc + d.impressoes, 0);
  const cliques = data.reduce((acc, d) => acc + d.cliques, 0);
  const conversoes = data.reduce((acc, d) => acc + d.conversoes, 0);

  const porPlataforma = (["Meta Ads", "Google Ads"] as AdPlatform[]).map((plataforma) => {
    const linhas = data.filter((d) => d.plataforma === plataforma);
    const invest = linhas.reduce((acc, d) => acc + d.investimento, 0);
    const clq = linhas.reduce((acc, d) => acc + d.cliques, 0);
    const conv = linhas.reduce((acc, d) => acc + d.conversoes, 0);
    return { plataforma, investimento: invest, cliques: clq, conversoes: conv };
  });

  const porDiaMap = new Map<string, { data: string; meta: number; google: number }>();
  for (const d of data) {
    const entry = porDiaMap.get(d.data) ?? { data: d.data, meta: 0, google: 0 };
    if (d.plataforma === "Meta Ads") entry.meta += d.investimento;
    else entry.google += d.investimento;
    porDiaMap.set(d.data, entry);
  }
  const porDia = [...porDiaMap.values()].sort((a, b) => a.data.localeCompare(b.data));

  const porCampanhaMap = new Map<string, {
    campanha: string;
    cliente: string;
    plataforma: AdPlatform;
    investimento: number;
    impressoes: number;
    cliques: number;
    conversoes: number;
  }>();
  for (const d of data) {
    const key = `${d.cliente}__${d.plataforma}__${d.campanha}`;
    const entry = porCampanhaMap.get(key) ?? {
      campanha: d.campanha,
      cliente: d.cliente,
      plataforma: d.plataforma,
      investimento: 0,
      impressoes: 0,
      cliques: 0,
      conversoes: 0,
    };
    entry.investimento += d.investimento;
    entry.impressoes += d.impressoes;
    entry.cliques += d.cliques;
    entry.conversoes += d.conversoes;
    porCampanhaMap.set(key, entry);
  }
  const porCampanha = [...porCampanhaMap.values()]
    .map((c) => ({
      ...c,
      ctr: safeDiv(c.cliques, c.impressoes) * 100,
      cpc: safeDiv(c.investimento, c.cliques),
      cpa: safeDiv(c.investimento, c.conversoes),
    }))
    .sort((a, b) => b.investimento - a.investimento);

  return {
    kpis: {
      investimento,
      impressoes,
      cliques,
      conversoes,
      ctr: safeDiv(cliques, impressoes) * 100,
      cpc: safeDiv(investimento, cliques),
      cpa: safeDiv(investimento, conversoes),
    },
    porPlataforma,
    porDia,
    porCampanha,
  };
}

export function getAllAdsClients(source: CampaignData[]): string[] {
  return [...new Set(source.map((d) => d.cliente))];
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
