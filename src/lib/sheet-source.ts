import { PerformanceData } from "@/types";
import { csvToObjects } from "@/lib/csv";
import { performanceData as mockData } from "@/data/mock";

const DEFAULT_META = 70;

function toNumber(value: string | undefined, fallback = 0): number {
  if (!value) return fallback;
  const normalized = value.replace(/\./g, "").replace(",", ".").replace("%", "");
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function rowsToPerformanceData(rows: Record<string, string>[]): PerformanceData[] {
  return rows
    .filter((row) => row.colaborador && row.mes)
    .map((row) => {
      const emDia = toNumber(row.em_dia ?? row.emdia ?? row["em dia"]);
      const atraso = toNumber(row.atraso);
      const total = emDia + atraso;
      const meta = toNumber(row.meta ?? row.meta_percentual, DEFAULT_META);
      const performance = total > 0 ? (emDia / total) * 100 : 0;

      return {
        mes: capitalize(row.mes.trim()),
        ano: toNumber(row.ano, new Date().getFullYear()),
        colaborador: row.colaborador.trim(),
        cargo: (row.cargo ?? "").trim(),
        cliente: (row.cliente ?? "Geral").trim() || "Geral",
        emDia,
        atraso,
        totalAtividades: total,
        performancePercentual: Number(performance.toFixed(2)),
        metaPercentual: meta,
        gapPercentual: Number((performance - meta).toFixed(2)),
      };
    });
}

export interface PerformanceSource {
  data: PerformanceData[];
  isDemo: boolean;
  error: string | null;
  fetchedAt: string;
}

export async function loadPerformanceData(): Promise<PerformanceSource> {
  const sheetUrl = process.env.GOOGLE_SHEET_CSV_URL;

  if (!sheetUrl) {
    return {
      data: mockData,
      isDemo: true,
      error: null,
      fetchedAt: new Date().toISOString(),
    };
  }

  try {
    const res = await fetch(sheetUrl, { next: { revalidate: 300 } });
    if (!res.ok) {
      throw new Error(`Planilha respondeu com status ${res.status}`);
    }
    const text = await res.text();
    const rows = csvToObjects(text);
    const data = rowsToPerformanceData(rows);

    if (data.length === 0) {
      throw new Error("A planilha foi lida, mas nenhuma linha válida foi encontrada.");
    }

    return {
      data,
      isDemo: false,
      error: null,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      data: mockData,
      isDemo: true,
      error: err instanceof Error ? err.message : "Erro ao carregar a planilha.",
      fetchedAt: new Date().toISOString(),
    };
  }
}
