import { NextResponse } from "next/server";
import { loadClientData } from "@/lib/client-source";

export const dynamic = "force-dynamic";

export async function GET() {
  const source = await loadClientData();
  return NextResponse.json(source);
}
