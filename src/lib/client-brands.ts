// Identidade visual por cliente final da agência: cor de marca, logo e cor de
// fundo do logo. Compartilhado entre a página de Clientes e a de Campanhas.

export interface ClientBrand {
  match: RegExp;
  color: string;
  logo?: string;
  logoBg?: string;
}

const CLIENT_BRANDS: ClientBrand[] = [
  { match: /loga/i, color: "#F59E0B", logo: "/logos/loga.png", logoBg: "#14294f" }, // laranja
  { match: /at3/i, color: "#3B82F6", logo: "/logos/at3.png", logoBg: "#ffffff" }, // azul
  { match: /jnnet/i, color: "#15803D", logo: "/logos/jnnet.png", logoBg: "#ffffff" }, // verde escuro
  { match: /netsul/i, color: "#22C55E", logo: "/logos/netsul.png", logoBg: "#000000" }, // verde claro
  { match: /acerta/i, color: "#1E3A8A" }, // azul escuro (sem logo)
];

// Cores para clientes sem marca definida (ex.: Grupo Jan).
const FALLBACK_COLORS = ["#8b5cf6", "#ec4899", "#6366f1", "#0ea5e9", "#14b8a6"];

export function hashIndex(name: string, mod: number): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return hash % mod;
}

export function getClientBrand(name: string): ClientBrand {
  return (
    CLIENT_BRANDS.find((c) => c.match.test(name)) ?? {
      match: /./,
      color: FALLBACK_COLORS[hashIndex(name, FALLBACK_COLORS.length)],
    }
  );
}

export function getClientColor(name: string): string {
  return getClientBrand(name).color;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}
