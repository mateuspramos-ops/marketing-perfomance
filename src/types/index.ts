export interface PerformanceData {
  mes: string;
  ano: number;
  colaborador: string;
  cargo: string;
  cliente: string;
  emDia: number;
  atraso: number;
  totalAtividades: number;
  performancePercentual: number;
  metaPercentual: number;
  gapPercentual: number;
}

export interface MonthlyStats {
  mes: string;
  emDia: number;
  atraso: number;
  total: number;
  performance: number;
}

export interface CollaboratorProfile {
  nome: string;
  cargo: string;
  dadosMensais: MonthlyStats[];
  totalAnual: {
    emDia: number;
    atraso: number;
    total: number;
    mediaPerformance: number;
  };
}

export interface DashboardFilters {
  mes?: string;
  ano?: number;
  cliente?: string;
}

export interface ProductivityData {
  mes: string;
  ano: number;
  colaborador: string;
  qtdClientes: number;
  qtdProjetos: number;
  qtdAtividades: number;
  qtdEtapas: number;
  totalHoras: number; // horas em decimal (ex.: 90.97)
  totalHorasLabel: string; // rótulo legível (ex.: "90h58")
}
