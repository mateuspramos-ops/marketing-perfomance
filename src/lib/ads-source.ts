import { CampaignData } from "@/types";
import { campaignData as mockData } from "@/data/mock";

/**
 * Fonte de dados de campanhas (Meta Ads + Google Ads).
 *
 * Hoje sempre retorna dados de demonstração. Quando as credenciais das APIs
 * estiverem prontas, troque `loadCampaignData` para chamar
 * `fetchMetaAdsData` / `fetchGoogleAdsData` de verdade (ver TODOs abaixo) e
 * combinar os resultados. O resto do dashboard (rota /api/campaigns, hook,
 * página) já está pronto para consumir o formato `CampaignData[]`.
 *
 * Variáveis de ambiente esperadas quando a integração real for ligada:
 * - META_ADS_ACCESS_TOKEN, META_ADS_ACCOUNT_ID
 * - GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET,
 *   GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_CUSTOMER_ID
 */

// TODO: implementar com a Meta Marketing API (Graph API) usando
// META_ADS_ACCESS_TOKEN + META_ADS_ACCOUNT_ID. Endpoint típico:
// GET /v20.0/act_{ad_account_id}/insights?fields=spend,impressions,clicks,actions&time_range=...
async function fetchMetaAdsData(): Promise<CampaignData[]> {
  throw new Error("Integração com Meta Ads ainda não configurada.");
}

// TODO: implementar com a Google Ads API (google-ads-api ou REST direto) usando
// GOOGLE_ADS_DEVELOPER_TOKEN + OAuth (client id/secret/refresh token) +
// GOOGLE_ADS_CUSTOMER_ID. Consulta GAQL típica sobre campaign / metrics.
async function fetchGoogleAdsData(): Promise<CampaignData[]> {
  throw new Error("Integração com Google Ads ainda não configurada.");
}

function hasMetaCredentials(): boolean {
  return Boolean(process.env.META_ADS_ACCESS_TOKEN && process.env.META_ADS_ACCOUNT_ID);
}

function hasGoogleCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN &&
      process.env.GOOGLE_ADS_REFRESH_TOKEN &&
      process.env.GOOGLE_ADS_CUSTOMER_ID
  );
}

export interface CampaignSource {
  data: CampaignData[];
  isDemo: boolean;
  error: string | null;
  fetchedAt: string;
}

export async function loadCampaignData(): Promise<CampaignSource> {
  const metaConfigured = hasMetaCredentials();
  const googleConfigured = hasGoogleCredentials();

  if (!metaConfigured && !googleConfigured) {
    return {
      data: mockData,
      isDemo: true,
      error: null,
      fetchedAt: new Date().toISOString(),
    };
  }

  try {
    const [meta, google] = await Promise.all([
      metaConfigured ? fetchMetaAdsData() : Promise.resolve<CampaignData[]>([]),
      googleConfigured ? fetchGoogleAdsData() : Promise.resolve<CampaignData[]>([]),
    ]);

    return {
      data: [...meta, ...google],
      isDemo: false,
      error: null,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      data: mockData,
      isDemo: true,
      error: err instanceof Error ? err.message : "Erro ao carregar dados de campanhas.",
      fetchedAt: new Date().toISOString(),
    };
  }
}
