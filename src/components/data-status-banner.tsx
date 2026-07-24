"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface DataStatusBannerProps {
  isDemo: boolean;
  error: string | null;
  onRefresh?: () => void;
  /** Mensagem exibida quando não há erro, apenas nenhuma fonte real configurada. */
  demoMessage?: string;
  /** Prefixo da mensagem de erro, antes do detalhe técnico entre parênteses. */
  errorMessage?: string;
}

export function DataStatusBanner({
  isDemo,
  error,
  onRefresh,
  demoMessage = "Exibindo dados de demonstração. Configure GOOGLE_SHEET_CSV_URL para conectar sua planilha.",
  errorMessage = "Exibindo dados de demonstração — não foi possível ler a planilha",
}: DataStatusBannerProps) {
  if (!isDemo && !error) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span className="flex-1">
        {error ? `${errorMessage} (${error}).` : demoMessage}
      </span>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 font-medium hover:bg-amber-500/25 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
