import { NextResponse } from "next/server";
import { loadCampaignData } from "@/lib/ads-source";

export const dynamic = "force-dynamic";

export async function GET() {
  const source = await loadCampaignData();
  return NextResponse.json(source);
}
