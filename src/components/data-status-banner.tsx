"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface DataStatusBannerProps {
  isDemo: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export function DataStatusBanner({ isDemo, error, onRefresh }: DataStatusBannerProps) {
  if (!isDemo && !error) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span className="flex-1">
        {error
          ? `Exibindo dados de demonstração — não foi possível ler a planilha (${error}).`
          : "Exibindo dados de demonstração. Configure GOOGLE_SHEET_CSV_URL para conectar sua planilha."}
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
