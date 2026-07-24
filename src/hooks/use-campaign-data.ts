"use client";

import { useEffect, useState, useCallback } from "react";
import { CampaignData } from "@/types";

interface CampaignApiResponse {
  data: CampaignData[];
  isDemo: boolean;
  error: string | null;
  fetchedAt: string;
}

const REFRESH_INTERVAL_MS = 60_000;

export function useCampaignData() {
  const [state, setState] = useState<{
    data: CampaignData[];
    isDemo: boolean;
    error: string | null;
    loading: boolean;
    fetchedAt: string | null;
  }>({ data: [], isDemo: false, error: null, loading: true, fetchedAt: null });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/campaigns", { cache: "no-store" });
      const json: CampaignApiResponse = await res.json();
      setState({
        data: json.data,
        isDemo: json.isDemo,
        error: json.error,
        loading: false,
        fetchedAt: json.fetchedAt,
      });
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Não foi possível conectar à fonte de dados.",
      }));
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  return { ...state, refresh: load };
}
