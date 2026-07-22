import { NextResponse } from "next/server";
import { loadPerformanceData } from "@/lib/sheet-source";

export const dynamic = "force-dynamic";

export async function GET() {
  const source = await loadPerformanceData();
  return NextResponse.json(source);
}
