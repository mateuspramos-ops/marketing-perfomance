// Helpers para o formato de horas acumuladas HH:MM:SS usado na planilha.

// "90:58:00" (HH:MM:SS acumulado) -> { horas: 90.97, label: "90h58" }
export function parseHoras(value: string | undefined): { horas: number; label: string } {
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
