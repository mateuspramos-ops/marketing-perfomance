import { ClientProjectData } from "@/types";
import { csvToObjects } from "@/lib/csv";
import { parseHoras } from "@/lib/horas";
import { clientProjectData as mockData } from "@/data/mock";

// gid da aba "projeto por cliente" dentro da planilha. Usado apenas para derivar a URL
// a partir de GOOGLE_SHEET_CSV_URL quando não há uma URL dedicada configurada.
const CLIENTS_GID = "1456283243";

function toInt(value: string | undefined): number {
  if (!value) return 0;
  const parsed = parseInt(value.replace(/\D/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

// A aba usa "Cliente" como coluna-chave (não "Colaborador"), então a detecção de
// cabeçalho padrão não se aplica — normalizamos e localizamos a linha pela coluna "cliente".
export function rowsToClientData(rows: Record<string, string>[]): ClientProjectData[] {
  return rows
    .filter((row) => row.cliente && row.mes)
    .map((row) => {
      const { horas, label } = parseHoras(row.total_de_tempo ?? row.total_horas);
      return {
        mes: capitalize(row.mes.trim()),
        ano: toInt(row.ano) || new Date().getFullYear(),
        cliente: row.cliente.trim(),
        projetos: toInt(row.projetos),
        atividades: toInt(row.atividades),
        etapas: toInt(row.etapas),
        totalHoras: horas,
        totalHorasLabel: label,
      };
    });
}

function resolveClientsUrl(): string | null {
  const dedicated = process.env.GOOGLE_SHEET_CLIENTS_CSV_URL;
  if (dedicated) return dedicated;

  const base = process.env.GOOGLE_SHEET_CSV_URL;
  if (!base) return null;

  try {
    const url = new URL(base);
    url.searchParams.set("gid", CLIENTS_GID);
    return url.toString();
  } catch {
    return null;
  }
}

export interface ClientSource {
  data: ClientProjectData[];
  isDemo: boolean;
  error: string | null;
  fetchedAt: string;
}

export async function loadClientData(): Promise<ClientSource> {
  const sheetUrl = resolveClientsUrl();

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
    const rows = csvToObjects(text, "cliente");
    const data = rowsToClientData(rows);

    if (data.length === 0) {
      throw new Error("A aba de clientes foi lida, mas nenhuma linha válida foi encontrada.");
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
      error: err instanceof Error ? err.message : "Erro ao carregar a aba de clientes.",
      fetchedAt: new Date().toISOString(),
    };
  }
}
