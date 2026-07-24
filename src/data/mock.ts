import { PerformanceData, ClientProjectData } from "@/types";

export const performanceData: PerformanceData[] = [
  // Janeiro 2026
  { mes: "Janeiro", ano: 2026, colaborador: "Carolina Brandão", cargo: "Designer", cliente: "Geral", emDia: 31, atraso: 4, totalAtividades: 35, performancePercentual: 88.57, metaPercentual: 70, gapPercentual: 18.57 },
  { mes: "Janeiro", ano: 2026, colaborador: "Janaína (Jana)", cargo: "Social Media", cliente: "Geral", emDia: 59, atraso: 25, totalAtividades: 84, performancePercentual: 70.24, metaPercentual: 70, gapPercentual: 0.24 },
  { mes: "Janeiro", ano: 2026, colaborador: "JP Pretti", cargo: "Designer", cliente: "Geral", emDia: 13, atraso: 16, totalAtividades: 29, performancePercentual: 44.83, metaPercentual: 70, gapPercentual: -25.17 },

  // Fevereiro 2026
  { mes: "Fevereiro", ano: 2026, colaborador: "Carolina Brandão", cargo: "Designer", cliente: "Geral", emDia: 32, atraso: 8, totalAtividades: 40, performancePercentual: 80.00, metaPercentual: 70, gapPercentual: 10.00 },
  { mes: "Fevereiro", ano: 2026, colaborador: "Janaína (Jana)", cargo: "Social Media", cliente: "Geral", emDia: 50, atraso: 52, totalAtividades: 102, performancePercentual: 49.02, metaPercentual: 70, gapPercentual: -20.98 },
  { mes: "Fevereiro", ano: 2026, colaborador: "JP Pretti", cargo: "Designer", cliente: "Geral", emDia: 13, atraso: 16, totalAtividades: 29, performancePercentual: 44.83, metaPercentual: 70, gapPercentual: -25.17 },

  // Março 2026
  { mes: "Março", ano: 2026, colaborador: "Carolina Brandão", cargo: "Designer", cliente: "Geral", emDia: 52, atraso: 16, totalAtividades: 68, performancePercentual: 76.74, metaPercentual: 70, gapPercentual: 6.74 },
  { mes: "Março", ano: 2026, colaborador: "Janaína (Jana)", cargo: "Social Media", cliente: "Geral", emDia: 88, atraso: 51, totalAtividades: 139, performancePercentual: 63.31, metaPercentual: 70, gapPercentual: -6.69 },
  { mes: "Março", ano: 2026, colaborador: "JP Pretti", cargo: "Designer", cliente: "Geral", emDia: 13, atraso: 27, totalAtividades: 40, performancePercentual: 32.50, metaPercentual: 70, gapPercentual: -37.50 },
  { mes: "Março", ano: 2026, colaborador: "Eliza Targa", cargo: "Assistente Mkt", cliente: "Geral", emDia: 10, atraso: 18, totalAtividades: 28, performancePercentual: 35.71, metaPercentual: 70, gapPercentual: -34.29 },

  // Abril 2026
  { mes: "Abril", ano: 2026, colaborador: "Fernanda Sinfronio", cargo: "Redatora", cliente: "Geral", emDia: 23, atraso: 3, totalAtividades: 26, performancePercentual: 88.46, metaPercentual: 70, gapPercentual: 18.46 },
  { mes: "Abril", ano: 2026, colaborador: "Carolina Brandão", cargo: "Designer", cliente: "Geral", emDia: 51, atraso: 14, totalAtividades: 65, performancePercentual: 78.46, metaPercentual: 70, gapPercentual: 8.46 },
  { mes: "Abril", ano: 2026, colaborador: "Raphael Silva", cargo: "Social Media", cliente: "Geral", emDia: 57, atraso: 24, totalAtividades: 81, performancePercentual: 70.37, metaPercentual: 70, gapPercentual: 0.37 },
  { mes: "Abril", ano: 2026, colaborador: "Janaína (Jana)", cargo: "Social Media", cliente: "Geral", emDia: 66, atraso: 45, totalAtividades: 111, performancePercentual: 59.46, metaPercentual: 70, gapPercentual: -10.54 },
  { mes: "Abril", ano: 2026, colaborador: "JP Pretti", cargo: "Designer", cliente: "Geral", emDia: 14, atraso: 13, totalAtividades: 27, performancePercentual: 51.85, metaPercentual: 70, gapPercentual: -18.15 },
  { mes: "Abril", ano: 2026, colaborador: "Eliza Targa", cargo: "Assistente Mkt", cliente: "Geral", emDia: 24, atraso: 26, totalAtividades: 50, performancePercentual: 48.00, metaPercentual: 70, gapPercentual: -22.00 },

  // Maio 2026
  { mes: "Maio", ano: 2026, colaborador: "Carolina Brandão", cargo: "Designer", cliente: "LOGA INTERNET", emDia: 55, atraso: 12, totalAtividades: 67, performancePercentual: 82.09, metaPercentual: 70, gapPercentual: 12.09 },
  { mes: "Maio", ano: 2026, colaborador: "Janaína (Jana)", cargo: "Social Media", cliente: "LOGA INTERNET", emDia: 83, atraso: 22, totalAtividades: 105, performancePercentual: 79.05, metaPercentual: 70, gapPercentual: 9.05 },
  { mes: "Maio", ano: 2026, colaborador: "Fernanda Sinfronio", cargo: "Redatora", cliente: "LOGA INTERNET", emDia: 15, atraso: 4, totalAtividades: 19, performancePercentual: 78.95, metaPercentual: 70, gapPercentual: 8.95 },
  { mes: "Maio", ano: 2026, colaborador: "Raphael Silva", cargo: "Social Media", cliente: "JNNET", emDia: 59, atraso: 54, totalAtividades: 113, performancePercentual: 52.21, metaPercentual: 70, gapPercentual: -17.79 },
  { mes: "Maio", ano: 2026, colaborador: "JP Pretti", cargo: "Designer", cliente: "NETSUL", emDia: 20, atraso: 22, totalAtividades: 42, performancePercentual: 47.62, metaPercentual: 70, gapPercentual: -22.38 },
  { mes: "Maio", ano: 2026, colaborador: "Eliza Targa", cargo: "Assistente Mkt", cliente: "AT3 INTERNET", emDia: 14, atraso: 18, totalAtividades: 32, performancePercentual: 43.75, metaPercentual: 70, gapPercentual: -26.25 },
];

export const mesesOrdem = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Dados de demonstração para a página de Clientes (aba "projeto por cliente").
export const clientProjectData: ClientProjectData[] = [
  { mes: "Janeiro", ano: 2026, cliente: "LOGA INTERNET", projetos: 14, atividades: 48, etapas: 163, totalHoras: 81.19, totalHorasLabel: "81h11" },
  { mes: "Janeiro", ano: 2026, cliente: "AT3 INTERNET", projetos: 5, atividades: 12, etapas: 27, totalHoras: 22.16, totalHorasLabel: "22h09" },
  { mes: "Janeiro", ano: 2026, cliente: "JNNET", projetos: 3, atividades: 6, etapas: 19, totalHoras: 23.47, totalHorasLabel: "23h28" },
  { mes: "Janeiro", ano: 2026, cliente: "NETSUL", projetos: 3, atividades: 6, etapas: 15, totalHoras: 2.73, totalHorasLabel: "2h44" },
  { mes: "Janeiro", ano: 2026, cliente: "GRUPO JAN", projetos: 2, atividades: 2, etapas: 6, totalHoras: 1.37, totalHorasLabel: "1h22" },
  { mes: "Fevereiro", ano: 2026, cliente: "LOGA INTERNET", projetos: 17, atividades: 55, etapas: 198, totalHoras: 152.82, totalHorasLabel: "152h48" },
  { mes: "Fevereiro", ano: 2026, cliente: "AT3 INTERNET", projetos: 6, atividades: 20, etapas: 51, totalHoras: 47.47, totalHorasLabel: "47h28" },
  { mes: "Fevereiro", ano: 2026, cliente: "NETSUL", projetos: 2, atividades: 8, etapas: 15, totalHoras: 12.24, totalHorasLabel: "12h14" },
  { mes: "Fevereiro", ano: 2026, cliente: "JNNET", projetos: 3, atividades: 5, etapas: 5, totalHoras: 8.58, totalHorasLabel: "8h34" },
  { mes: "Fevereiro", ano: 2026, cliente: "GRUPO JAN", projetos: 3, atividades: 4, etapas: 12, totalHoras: 9.21, totalHorasLabel: "9h12" },
  { mes: "Março", ano: 2026, cliente: "LOGA INTERNET", projetos: 14, atividades: 75, etapas: 254, totalHoras: 226.09, totalHorasLabel: "226h05" },
  { mes: "Março", ano: 2026, cliente: "AT3 INTERNET", projetos: 3, atividades: 14, etapas: 40, totalHoras: 41.57, totalHorasLabel: "41h34" },
  { mes: "Março", ano: 2026, cliente: "JNNET", projetos: 3, atividades: 4, etapas: 8, totalHoras: 11.51, totalHorasLabel: "11h30" },
  { mes: "Março", ano: 2026, cliente: "NETSUL", projetos: 2, atividades: 10, etapas: 35, totalHoras: 40.28, totalHorasLabel: "40h16" },
  { mes: "Março", ano: 2026, cliente: "ACERTA GESTÃO ESTRATÉGICA", projetos: 1, atividades: 1, etapas: 2, totalHoras: 4.21, totalHorasLabel: "4h12" },
  { mes: "Março", ano: 2026, cliente: "GRUPO JAN", projetos: 1, atividades: 1, etapas: 1, totalHoras: 0.08, totalHorasLabel: "0h05" },
  { mes: "Março", ano: 2026, cliente: "ACERTA-GHO", projetos: 1, atividades: 1, etapas: 3, totalHoras: 1.75, totalHorasLabel: "1h45" },
  { mes: "Abril", ano: 2026, cliente: "LOGA INTERNET", projetos: 19, atividades: 114, etapas: 285, totalHoras: 298.23, totalHorasLabel: "298h13" },
  { mes: "Abril", ano: 2026, cliente: "AT3 INTERNET", projetos: 8, atividades: 20, etapas: 69, totalHoras: 38.78, totalHorasLabel: "38h46" },
  { mes: "Abril", ano: 2026, cliente: "ACERTA GESTÃO ESTRATÉGICA", projetos: 1, atividades: 6, etapas: 23, totalHoras: 13.04, totalHorasLabel: "13h02" },
  { mes: "Abril", ano: 2026, cliente: "NETSUL", projetos: 4, atividades: 11, etapas: 41, totalHoras: 63.03, totalHorasLabel: "63h02" },
  { mes: "Abril", ano: 2026, cliente: "JNNET", projetos: 4, atividades: 9, etapas: 30, totalHoras: 20.34, totalHorasLabel: "20h20" },
  { mes: "Abril", ano: 2026, cliente: "ACERTA-GHO", projetos: 1, atividades: 1, etapas: 2, totalHoras: 1.67, totalHorasLabel: "1h40" },
  { mes: "Maio", ano: 2026, cliente: "LOGA INTERNET", projetos: 12, atividades: 79, etapas: 220, totalHoras: 199.88, totalHorasLabel: "199h53" },
  { mes: "Maio", ano: 2026, cliente: "ACERTA GESTÃO ESTRATÉGICA", projetos: 3, atividades: 11, etapas: 19, totalHoras: 16.32, totalHorasLabel: "16h19" },
  { mes: "Maio", ano: 2026, cliente: "JNNET", projetos: 7, atividades: 17, etapas: 64, totalHoras: 87.83, totalHorasLabel: "87h49" },
  { mes: "Maio", ano: 2026, cliente: "AT3 INTERNET", projetos: 4, atividades: 14, etapas: 62, totalHoras: 42.23, totalHorasLabel: "42h14" },
  { mes: "Maio", ano: 2026, cliente: "NETSUL", projetos: 3, atividades: 15, etapas: 56, totalHoras: 43.83, totalHorasLabel: "43h49" },
  { mes: "Maio", ano: 2026, cliente: "ACERTA-GHO", projetos: 1, atividades: 1, etapas: 1, totalHoras: 1, totalHorasLabel: "1h00" },
  { mes: "Junho", ano: 2026, cliente: "LOGA INTERNET", projetos: 23, atividades: 71, etapas: 181, totalHoras: 167.41, totalHorasLabel: "167h24" },
  { mes: "Junho", ano: 2026, cliente: "ACERTA GESTÃO ESTRATÉGICA", projetos: 5, atividades: 18, etapas: 44, totalHoras: 44.61, totalHorasLabel: "44h36" },
  { mes: "Junho", ano: 2026, cliente: "AT3 INTERNET", projetos: 7, atividades: 30, etapas: 83, totalHoras: 93.65, totalHorasLabel: "93h38" },
  { mes: "Junho", ano: 2026, cliente: "NETSUL", projetos: 6, atividades: 20, etapas: 64, totalHoras: 47.75, totalHorasLabel: "47h44" },
  { mes: "Junho", ano: 2026, cliente: "JNNET", projetos: 7, atividades: 17, etapas: 65, totalHoras: 53.09, totalHorasLabel: "53h05" },
  { mes: "Junho", ano: 2026, cliente: "ACERTA-GHO", projetos: 1, atividades: 2, etapas: 4, totalHoras: 0.36, totalHorasLabel: "0h21" },
];

