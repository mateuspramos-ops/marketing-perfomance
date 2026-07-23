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

export interface ClientProjectData {
  mes: string;
  ano: number;
  cliente: string;
  projetos: number;
  atividades: number;
  etapas: number;
  totalHoras: number; // horas em decimal
  totalHorasLabel: string; // rótulo legível (ex.: "81h11")
}
