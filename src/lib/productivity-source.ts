import { ProductivityData } from "@/types";
import { csvToObjects } from "@/lib/csv";
import { productivityData as mockData } from "@/data/mock";

// gid da aba de produtividade dentro da planilha. Usado apenas para derivar a URL
// a partir de GOOGLE_SHEET_CSV_URL quando não há uma URL dedicada configurada.
const PRODUCTIVITY_GID = "277737850";

function toInt(value: string | undefined): number {
  if (!value) return 0;
  const parsed = parseInt(value.replace(/\D/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

// "90:58:00" (HH:MM:SS acumulado) -> { horas: 90.97, label: "90h58" }
function parseHoras(value: string | undefined): { horas: number; label: string } {
  if (!value) return { horas: 0, label: "0h00" };
  const parts = value.split(":").map((p) => parseInt(p, 10));
  const [h = 0, m = 0, s = 0] = parts.map((n) => (Number.isFinite(n) ? n : 0));
  const horas = h + m / 60 + s / 3600;
  return { horas: Number(horas.toFixed(2)), label: `${h}h${String(m).padStart(2, "0")}` };
}

export function formatHoras(decimal: number): string {
  const totalMin = Math.round(decimal * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h${String(m).padStart(2, "0")}`;
}

export function rowsToProductivityData(rows: Record<string, string>[]): ProductivityData[] {
  return rows
    .filter((row) => row.colaborador && row.mes)
    .map((row) => {
      const { horas, label } = parseHoras(row.total_horas_hhmm ?? row.total_horas);
      return {
        mes: capitalize(row.mes.trim()),
        ano: toInt(row.ano) || new Date().getFullYear(),
        colaborador: row.colaborador.trim(),
        qtdClientes: toInt(row.qtd_clientes),
        qtdProjetos: toInt(row.qtd_projetos),
        qtdAtividades: toInt(row.qtd_atividades),
        qtdEtapas: toInt(row.qtd_etapas),
        totalHoras: horas,
        totalHorasLabel: label,
      };
    });
}

function resolveProductivityUrl(): string | null {
  const dedicated = process.env.GOOGLE_SHEET_PRODUCTIVITY_CSV_URL;
  if (dedicated) return dedicated;

  const base = process.env.GOOGLE_SHEET_CSV_URL;
  if (!base) return null;

  try {
    const url = new URL(base);
    url.searchParams.set("gid", PRODUCTIVITY_GID);
    return url.toString();
  } catch {
    return null;
  }
}

export interface ProductivitySource {
  data: ProductivityData[];
  isDemo: boolean;
  error: string | null;
  fetchedAt: string;
}

export async function loadProductivityData(): Promise<ProductivitySource> {
  const sheetUrl = resolveProductivityUrl();

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
    const data = rowsToProductivityData(rows);

    if (data.length === 0) {
      throw new Error("A aba de produtividade foi lida, mas nenhuma linha válida foi encontrada.");
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
      error: err instanceof Error ? err.message : "Erro ao carregar a aba de produtividade.",
      fetchedAt: new Date().toISOString(),
    };
  }
}
